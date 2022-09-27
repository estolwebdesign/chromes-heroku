import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../Context/UserContext";
import { API, HOST, PRODUCTION_API } from "../../Global";
import Swal from "sweetalert2";
import Moment from "react-moment";
import "moment/locale/es-mx";
import useForm from "../../Hooks/useForm";
import $ from "jquery";
import { io } from "socket.io-client";
import Modal from "react-bootstrap/Modal";

const UserTransactions = () => {
  const socket = useRef();
  const { user } = useContext(UserContext);
  const [transactions, setTransactions] = useState();
  const [repeated, setRepeated] = useState();
  const [transaction, setTransaction] = useState();
  const [chat, setChat] = useState();
  const navigate = useNavigate();
  const [formValues, handleInputChange] = useForm({
    message: "",
    value: "",
  });
  const [receivedMsg, setReceivedMsg] = useState();
  const [chatShow, setChatShow] = useState(false);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const { message, value } = formValues;

  useEffect(() => {
    if (!transaction && socket.current) {
      socket.current = undefined;
    }

    return () => {};
  }, [transaction]);

  useEffect(() => {
    if (receivedMsg) {
      setChat([...chat, receivedMsg]);
      setReceivedMsg(undefined);
    }

    return () => {};
  }, [receivedMsg]);

  useEffect(() => {
    if (user) {
      const requestOptions = {
        method: "GET",
        credentials: "include",
      };

      fetch(`${API}/transactions/${user.id}`, JSON.stringify(requestOptions))
        .then(async (res) => {
          const data = await res.json();
          setTransactions(data.transactions);
        })
        .catch((err) => {
          console.error(err);
        });
    }

    if (user === null) {
      navigate("/sign-in");
    }

    return () => {};
  }, [user]);

  const getRepeated = (transId, userId) => {
    const requestOptions = {
      method: "GET",
      credentials: "include",
    };

    fetch(`${API}/users/get-repeated/${userId}`, JSON.stringify(requestOptions))
      .then(async (res) => {
        const data = await res.json();
        setRepeated(data.repeated);
        setTransaction(transactions.filter((trans) => trans._id === transId)[0]);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const chooseRepeated = (trans, id) => {
    const body = {
      chrome: id,
    };

    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    };

    fetch(`${API}/transactions/select-chrome/${trans}/${user.id}`, JSON.stringify(requestOptions))
      .then(async (res) => {
        const data = await res.json();
        setTransactions(data.transactions);
        Swal.fire(
          "Figurita seleccionada",
          "Has selecctionado la figurita que recibiras en el intercambio. Ahora te toca esperar para ver si el otro usuario acepta intercambiar esta figurita contigo",
          "success"
        );
        setRepeated(undefined);
        setTransaction(undefined);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const cancelTransaction = (id) => {
    const requestOptions = {
      method: "PUT",
      credentials: "include",
    };

    fetch(`${API}/transactions/cancel/${id}/${user.id}`, JSON.stringify(requestOptions))
      .then(async (res) => {
        const data = await res.json();
        setTransactions(data.transactions);
        Swal.fire("Transacción cancelada", "La transacción ha sido cancelada", "success");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const acceptTransaction = (id) => {
    const requestOptions = {
      method: "PUT",
      credentials: "include",
    };
    
    fetch(`${API}/transactions/accept/${id}/${user.id}`, JSON.stringify(requestOptions))
      .then(async (res) => {
        const data = await res.json();
        setTransactions(data.transactions);
        Swal.fire("Transacción aceptada", "La transacción ha sido aceptada, ya puedes empezar a chatear con tu contraparte para coordinar el intercambio físico de las figuritas", "info");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const closeTransaction = (id) => {
    const requestOptions = {
      method: "PUT",
      credentials: "include",
    };
    
    fetch(`${API}/transactions/close/${id}/${user.id}`, JSON.stringify(requestOptions))
      .then(async (res) => {
        const data = await res.json();
        setTransactions(data.transactions);
        const transaction = transactions.filter((trans) => trans._id === id);
        setTransaction(transaction[0]);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const openChat = (id) => {
    setChatShow(true);
    const transaction = transactions.filter((trans) => trans._id === id);
    setTransaction(transaction[0]);
    setChat(transaction[0].messages);
    socket.current = io(HOST);
    socket.current.emit("add-user", user.id);
    socket.current.on("response", (data) => {
      setReceivedMsg(data);
    });
  };

  const handleChatClose = () => {
    setChatShow(false);
    setTransaction(undefined);
    setChat(undefined);
    socket.current.disconnect();
  };

  const sendMessage = (e) => {
    e.preventDefault();

    const body = {
      transaction: transaction._id,
      remitter: user.id,
      receiver: user.id === transaction.from._id ? transaction.to : transaction.from,
      content: message,
    }

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    };
    
    fetch(`${API}/messages/new-message`, JSON.stringify(requestOptions))
      .then(async (res) => {
        const data = await res.json();
        const messages = data.transaction.messages;

        const sockMsg = {
          receiver: user.id === transaction.from._id ? transaction.to : transaction.from,
          messageObj: data.message,
        };

        socket.current.emit("send-msg", sockMsg);

        setChat(messages);
      })
      .catch((err) => {
        console.error(err);
      });

    formValues.message = "";
  };

  const handleRateSubmit = (e) => {
    e.preventDefault();

    const body = {
      rating: rating,
      value: value,
      author: user.id,
    };

    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    };
    
    fetch(`${API}/transactions/rate/${transaction._id}`, JSON.stringify(requestOptions))
      .then(async (res) => {
        const data = await res.json();
        setTransactions(data.transactions);
        Swal.fire(
          "Valoración enviada",
          `Tu valoracion de la transaccion con ${user?.id === transaction.from._id ? transaction.to.username : transaction.from.username} ha sido enviada correctamente`,
          "success"
        );
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <main>
      <div className="container bg-light rounded shadow p-3 mt-3">
        <div className="d-flex flex-column position-relative w-100">
          <hr className="text-light mt-4 w-100 position-absolute" style={{ borderTop: "4px solid #5c0931" }} />
          <h1 className="text-center bg-qatar px-5 rounded-pill mx-auto fw-bold text-qatar text-light" style={{ zIndex: "1050" }}>
            INTERCAMBIOS
          </h1>
        </div>
        <section className="transactions">
          {transactions?.map((trans, i) => (
            <article id={`transaction-${trans._id}`} key={i} className="border border-qatar rounded mt-2">
              <div className="row g-2 p-2">
                <div className="col">
                  <div className="fs-3 d-flex justify-content-center pb-2">
                    <FontAwesomeIcon icon={faArrowRight} />
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <div
                    className={`${(user?.id === trans.from._id && !trans.chromes.get) || (user?.id === trans.to._id && !trans.chromes.drop) ? "bg-secondary" : "bg-success"}  mx-auto rounded `}
                    style={{ height: "200px", width: "133px" }}
                  >
                    <div className="d-flex flex-column h-100">
                      <div className={`${(user?.id === trans.from._id && !trans.chromes.get) || (user?.id === trans.to._id && !trans.chromes.drop) ? "fs-5" : "fs-3"} text-light fw-bold m-auto`}>
                        {user?.id === trans.from._id ? trans.chromes.get.name : user?.id === trans.to._id && trans.chromes.drop ? trans.chromes.drop.name : "Desconocido"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="fs-3 d-flex justify-content-center pb-2">
                    <FontAwesomeIcon icon={faUser} />
                    <FontAwesomeIcon icon={faArrowRight} />
                  </div>
                  <div
                    className={`mx-auto rounded ${(user?.id === trans.from._id && !trans.chromes.drop) || (user?.id === trans.to._id && !trans.chromes.get) ? "bg-secondary" : "bg-success"}`}
                    style={{ height: "200px", width: "133px" }}
                  >
                    <div className="d-flex flex-column h-100">
                      <div className={`${(user?.id === trans.from._id && !trans.chromes.drop) || (user?.id === trans.to._id && !trans.chromes.get) ? "fs-5" : "fs-3"} text-light fw-bold m-auto`}>
                        {user?.id === trans.from._id && trans.chromes.drop ? trans.chromes.drop.name : user?.id === trans.to._id && trans.chromes.get ? trans.chromes.get.name : "Desconocido"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="text-center fs-3 fw-bold">Usuario: {user?.id === trans.from._id ? trans.to.username : trans.from.username}</div>
                  <table className="table table-striped text-center border p-1 rounded">
                    <tbody>
                      <tr>
                        <th scope="row" className="px-4">
                          Estado:
                        </th>
                        <td className={!trans.accepted && !trans.cancelled && !trans.closed ? "bg-warning" : trans.accepted ? "bg-primary" : trans.closed ? "bg-success" : "bg-danger"}>
                          {!trans.accepted && !trans.cancelled && !trans.closed ? (
                            <span className="text-dark fw-bold">PENDIENTE</span>
                          ) : trans.accepted ? (
                            <span className="text-light fw-bold">ACEPTADA</span>
                          ) : trans.closed ? (
                            <span className="text-light fw-bold">FINALIZADA</span>
                          ) : (
                            trans.cancelled && <span className="text-light fw-bold">CANCELADA</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4">
                          Descipción:
                        </th>
                        <td>
                          {!trans.chromes.drop ? (
                            <span>
                              {user?.id === trans.from._id
                                ? `${trans.to.username} tiene que elegir una de tus figuritas repetidas`
                                : `Es tu turno de elegir una figurita de ${trans.from.username} para realizar el itercambio. Si no encuentras ninguna figurita que necesites puedes rechazar el intercambio`}
                            </span>
                          ) : trans.chromes.drop && (!trans.accepted || !trans.cancelled) ? (
                            <span>
                              {user?.id === trans.from._id
                                ? `${trans.to.username} ya eligió unas de tus figuritas repetidas, ahora te toca a ti decidir si aceptas el intercambio o no.`
                                : `${trans.from.username} tiene que decidir si acepta el intercambio por la figurita que elegiste o no.`}{" "}
                            </span>
                          ) : trans.accepted && !trans.cancelled ? (
                            <span>La transaccion fue aceptada por ambas partes, ya pueden empezar a hablar entre ustedes para coordinar el intercambio.</span>
                          ) : (
                            trans.cancelled && <span>La transaccion ha sido cancelada.</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4">
                          Acciones:
                        </th>
                        <td>
                          {user?.id === trans.to._id && !trans.chromes.drop ? (
                            <div className="btn-group">
                              <button className="btn btn-sm btn-primary" onClick={() => getRepeated(trans._id, trans.from._id)} data-bs-toggle="modal" data-bs-target="#exampleModal" type="button">
                                Elegir figurita
                              </button>
                              <button onClick={() => cancelTransaction(trans._id)} className="btn btn-sm btn-danger">
                                Cancelar intercambio
                              </button>
                            </div>
                          ) : user?.id === trans.from._id && trans.chromes.drop && trans.accepted === null && !trans.closed && !trans.cancelled ? (
                            <div className="btn-group">
                              <button onClick={() => acceptTransaction(trans._id)} className="btn btn-sm btn-success">
                                Aceptar intercambio
                              </button>
                              <button onClick={() => cancelTransaction(trans._id)} className="btn btn-sm btn-danger">
                                Cancelar intercambio
                              </button>
                            </div>
                          ) : (
                            trans.accepted && (
                              <div className="btn-group">
                                <button onClick={() => openChat(trans._id)} className="btn btn-sm btn-warning">
                                  Abrir chat
                                </button>
                                <button onClick={() => closeTransaction(trans._id)} className="btn btn-sm btn-success" data-bs-toggle="modal" data-bs-target="#rateModal" type="button">
                                  Intercambio finalizado
                                </button>
                                <button onClick={() => cancelTransaction(trans._id)} className="btn btn-sm btn-danger">
                                  Cancelar intercambio
                                </button>
                              </div>
                            )
                          )}
                          {!trans.accepted && trans.closed && user.id === trans.from._id ? (
                            <>
                              {trans.userRates.recipiant.rate ? (
                                <div>No hay acciones disponibles</div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setTransaction(trans);
                                  }}
                                  className="btn btn-sm btn-warning"
                                  data-bs-toggle="modal"
                                  data-bs-target="#rateModal"
                                  type="button"
                                >
                                  Calificar intercambio
                                </button>
                              )}
                            </>
                          ) : !trans.accepted && trans.closed && user.id === trans.to._id ? (
                            <>
                              {trans.userRates.offerer?.rate ? (
                                <div>No hay acciones disponibles</div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setTransaction(trans);
                                  }}
                                  className="btn btn-sm btn-warning"
                                  data-bs-toggle="modal"
                                  data-bs-target="#rateModal"
                                  type="button"
                                >
                                  Calificar intercambio
                                </button>
                              )}
                            </>
                          ) : (
                            <div>No hay acciones disponibles</div>
                          )}
                        </td>
                      </tr>
                      {(trans.userRates.recipiant.rate || trans.userRates.offerer.rate) && (
                        <>
                          <tr>
                            <th scope="row" className="px-4">
                              Calificacion recibida
                            </th>
                            <td>
                              {user.id === trans.from._id && trans.userRates.offerer.rate ? (
                                <>
                                  {[1, 2, 3, 4, 5].map((num) => {
                                    return trans.userRates.offerer.rate >= num ? (
                                      <span key={num} className="star on fs-2">
                                        &#9733;
                                      </span>
                                    ) : (
                                      <span key={num} className="star off fs-2">
                                        &#9733;
                                      </span>
                                    );
                                  })}
                                  {trans.userRates.offerer.value ? (
                                    <div>{trans.userRates.offerer.value}</div>
                                  ) : (
                                    <small className="d-block">{trans.to.username} no ha escrito una valoracion sobre ti.</small>
                                  )}
                                </>
                              ) : user.id === trans.to._id && trans.userRates.recipiant.rate ? (
                                <>
                                  {[1, 2, 3, 4, 5].map((num) => {
                                    return trans.userRates.recipiant.rate >= num ? (
                                      <span key={num} className="star on fs-2">
                                        &#9733;
                                      </span>
                                    ) : (
                                      <span key={num} className="star off fs-2">
                                        &#9733;
                                      </span>
                                    );
                                  })}
                                  {trans.userRates.recipiant.value ? (
                                    <div>{trans.userRates.recipiant.value}</div>
                                  ) : (
                                    <small className="d-block">{trans.from.username} no ha escrito una valoracion sobre ti.</small>
                                  )}
                                </>
                              ) : (
                                <div>Nada por aquí aun</div>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <th scope="row" className="px-4">
                              Calificacion otorgada
                            </th>
                            <td>
                              {user.id === trans.from._id && trans.userRates.recipiant.rate ? (
                                <>
                                  {[1, 2, 3, 4, 5].map((num) => {
                                    return trans.userRates.recipiant.rate >= num ? (
                                      <span key={num} className="star on fs-2">
                                        &#9733;
                                      </span>
                                    ) : (
                                      <span key={num} className="star off fs-2">
                                        &#9733;
                                      </span>
                                    );
                                  })}
                                  {trans.userRates.recipiant.value ? (
                                    <div>{trans.userRates.recipiant.value}</div>
                                  ) : (
                                    <small className="d-block">No has escrito una valoracion sobre tu contraparte.</small>
                                  )}
                                </>
                              ) : user.id === trans.to._id && trans.userRates.offerer.rate ? (
                                <>
                                  {[1, 2, 3, 4, 5].map((num) => {
                                    return trans.userRates.offerer.rate >= num ? (
                                      <span key={num} className="star on fs-2">
                                        &#9733;
                                      </span>
                                    ) : (
                                      <span key={num} className="star off fs-2">
                                        &#9733;
                                      </span>
                                    );
                                  })}
                                  {trans.userRates.offerer.value ? <div>{trans.userRates.offerer.value}</div> : <small className="d-block">No has escrito una valoracion sobre tu contraparte.</small>}
                                </>
                              ) : (
                                <div>Nada por aquí aun</div>
                              )}
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Elige una figurita
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {!repeated ? (
                <div className="lds-grid">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                <>
                  <div className="row g-2 justify-content-center">
                    {repeated.map((repeat, i) => {
                      return (
                        !user?.chromes.includes(repeat.chrome._id) && (
                          <div className="col">
                            <article className={`bg-secondary mx-auto rounded shadow bg-success p-0`} style={{ height: "200px", width: "133px" }}>
                              <div className="d-flex flex-column h-100">
                                <div className="fs-3 text-light fw-bold m-auto">{repeat.chrome.name}</div>
                                <button className="btn btn-qatar w-100" onClick={() => chooseRepeated(transaction._id, repeat.chrome._id)} data-bs-dismiss="modal" aria-label="Close" type="button">
                                  Elegir
                                </button>
                              </div>
                            </article>
                          </div>
                        )
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal show={chatShow} onHide={handleChatClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h5 className="modal-title" id="chatModalLabel">
              Chatea con <span className="fw-bold">{user?.id === transaction?.to._id ? transaction?.from.username : user?.id === transaction?.from._id && transaction?.to.username}</span>
            </h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!chat ? (
            <div className="lds-grid">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          ) : (
            <>
              <section className="d-flex flex-column">
                {chat.length < 1 ? (
                  <p>No hay mensajes aún</p>
                ) : (
                  <div id="chat-container">
                    {chat
                      .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
                      .map((message, i) => (
                        <div key={i} className={`${user?.id === message.remitter._id ? "ms-auto message-send" : "me-auto message-recived text-light"} mw-75 p-2 rounded mb-2`}>
                          <div>
                            <Moment element="small" format="HH:mm - DD MMMM">
                              {message.createdAt}
                            </Moment>
                          </div>
                          <div className={`${user?.id === message.remitter._id ? "text-end" : ""}`}>{message.content}</div>
                          <div>{message.recivedAt && !message.readAt ? <small>Recibido</small> : message.readAt && <small>Leído</small>}</div>
                        </div>
                      ))}
                  </div>
                )}
                <form id="chat-form" className="d-flex" onSubmit={sendMessage}>
                  <input className="form-control me-2" rows="1" name="message" id="message" value={message} onChange={handleInputChange} placeholder="Escribe aquí tu mensaje..." />
                  <input type="submit" className="btn btn-warning" value={"Enviar"} />
                </form>
              </section>
            </>
          )}
        </Modal.Body>
      </Modal>

      <div className="modal fade" id="rateModal" tabIndex="-1" aria-labelledby="rateModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="rateModalLabel">
                Califica la transaccion con <span className="fw-bold">{transaction?.to.username}</span>
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {!transaction ? (
                <div className="lds-grid">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                <>
                  <section className="d-flex flex-column">
                    <div className="star-rating fs-1 text-center">
                      {[...Array(5)].map((star, index) => {
                        index += 1;
                        return (
                          <button
                            type="button"
                            key={index}
                            className={index <= (hover || rating) ? "on" : "off"}
                            onClick={() => setRating(index)}
                            onMouseEnter={() => setHover(index)}
                            onMouseLeave={() => setHover(rating)}
                          >
                            <span className="star">&#9733;</span>
                          </button>
                        );
                      })}

                      <div>
                        <form onSubmit={handleRateSubmit}>
                          <textarea
                            rows="3"
                            className="form-control"
                            name="valoration"
                            id="valoration"
                            value={value}
                            placeholder="Si lo deseas puedes dejar un comentario además de la puntuación..."
                            onChange={handleInputChange}
                          ></textarea>
                          <button type="submit" className="btn btn-warning" data-bs-dismiss="modal" aria-label="Close">
                            Enviar
                          </button>
                        </form>
                      </div>
                    </div>
                  </section>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserTransactions;
