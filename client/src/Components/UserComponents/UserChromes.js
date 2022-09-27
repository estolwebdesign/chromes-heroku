import React, { useContext, useEffect, useState } from "react";
import { API, TEAMS, PRODUCTION_API } from "../../Global";
import UserContext from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const UserChromes = () => {
  const [chromes, setChromes] = useState();
  const { user } = useContext(UserContext);
  const [userChromes, setUserChromes] = useState();
  const [repeatedChromes, setRepeatedChromes] = useState([]);
  const navigate = useNavigate();
  const [clicked, setClicked] = useState();

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      credentials: "include",
    };
    
    fetch(`${API}/chromes/get-all`, requestOptions)
      .then(async (res) => {
        const data = await res.json();
        setChromes(data.chromes);
      })
      .catch((err) => {
        console.error(err);
      });

    return () => {};
  }, []);

  useEffect(() => {
    if (user) {
      setUserChromes(user.chromes);
      setRepeatedChromes(user.repeated);
    }

    if (user === null) {
      navigate("/sign-in");
    }

    return () => {};
  }, [user, navigate]);

  const handleNewChrome = async (chromeId) => {
    setClicked(chromeId);

    const requestOptions = {
      method: "GET",
      credentials: "include",
    };
    
    await fetch(`${API}/users/add-chrome/${user.id}/${chromeId}`, requestOptions)
      .then(async (res) => {
        const data = await res.json();
        setUserChromes(data.user.chromes);
        setRepeatedChromes(data.user.repeated);
      })
      .catch((err) => {
        console.error(err);
      });

    setClicked();
  };

  const handleRemoveChrome = (chromeId) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Estas a punto de descontar una figurita de tu lista",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar una!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const requestOptions = {
          method: "PUT",
          credentials: "include",
        };
        
        fetch(`${API}/users/remove-chrome/${user.id}/${chromeId}`, requestOptions)
          .then(async (res) => {
            const data = await res.json();
            setUserChromes(data.user.chromes);
            setRepeatedChromes(data.user.repeated);
          })
          .catch((err) => {
            console.error(err);
          });

        Swal.fire("Eliminada!", "Una figurita ha sido descontada de tu lista.", "success");
      } else {
        Swal.fire("¡Acción cancelada!", "Tu figurita está a salvo", "info");
      }
    });
  };

  return (
    <main>
      <div className="container my-3 p-3 bg-light rounded">
        {user === undefined ? (
          <div className="text-center">
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
          </div>
        ) : (
          <>
            <div className="d-flex flex-column position-relative">
              <hr className="text-light mt-4 w-100 position-absolute" style={{ borderTop: "4px solid #5c0931" }} />
              <h1 className="text-center bg-qatar px-5 rounded-pill mx-auto fw-bold text-qatar text-light" style={{ zIndex: "1050" }}>
                FIGURITAS
              </h1>
            </div>
            <div className="pt-3">
              <section id="fwc-1" className="bg-qatar bg-team rounded mt-3 shadow">
                <div className="row g-2">
                  <div className="d-flex flex-column position-relative">
                    <hr className="text-light mt-3 w-100 position-absolute" style={{ borderTop: "4px solid #f8f9fa" }} />
                    <h3 className="text-center bg-light px-5 rounded-pill mx-auto fw-bold text-qatar">FWC</h3>
                  </div>
                  {chromes?.map((chrome, i) => {
                    return (
                      i < 19 && (
                        <div key={i} className="col-lg-2 col-md-3 col-6">
                          <article className={`bg-secondary mx-auto rounded ${userChromes?.includes(chrome._id) ? "bg-success" : "bg-danger"}`} style={{ height: "200px", width: "133px" }}>
                            {userChromes?.includes(chrome._id) ? (
                              <div className="d-flex flex-column h-100">
                                {repeatedChromes?.map((repeat, i) => {
                                  return (
                                    repeat.chrome === chrome._id && (
                                      <div key={i} className="bg-warning text-center fw-bold rounded-top">
                                        REPETIDA
                                      </div>
                                    )
                                  );
                                })}
                                <div className="fs-3 text-light fw-bold m-auto">{chrome.name}</div>
                                {repeatedChromes?.filter((rep) => rep.chrome === chrome._id).length > 0 ? (
                                  <>
                                    {repeatedChromes.map((repeat, i) => {
                                      return (
                                        repeat.chrome === chrome._id && (
                                          <div key={i} className="d-flex bg-warning text-center align-items-center rounded-bottom">
                                            {clicked === chrome._id ? (
                                              <button className={`btn btn-sm btn-qatar rounded-bottom w-100 ${clicked === chrome._id && "disabled"}`}>
                                                <div className="spinner-border spinner-border-sm text-light" role="status">
                                                  <span className="visually-hidden">Loading...</span>
                                                </div>
                                              </button>
                                            ) : (
                                              <>
                                                <button onClick={() => handleRemoveChrome(chrome._id)} className="btn btn-sm btn-qatar chrome-down">
                                                  -1
                                                </button>
                                                <div className="mx-auto fw-bold">X{repeat.quantity}</div>
                                                <button onClick={() => handleNewChrome(chrome._id)} className="btn btn-sm btn-qatar chrome-up">
                                                  +1
                                                </button>
                                              </>
                                            )}
                                          </div>
                                        )
                                      );
                                    })}
                                  </>
                                ) : (
                                  <button onClick={() => handleNewChrome(chrome._id)} className={`btn btn-sm btn-qatar rounded-bottom w-100 ${clicked === chrome._id && "disabled"}`}>
                                    {clicked === chrome._id ? (
                                      <div className="spinner-border spinner-border-sm text-light" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                      </div>
                                    ) : (
                                      "Agregar 1"
                                    )}
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div className="d-flex flex-column h-100">
                                <div className="fs-3 text-light fw-bold m-auto">{chrome.name}</div>
                                <form
                                  onSubmit={(e) => {
                                    e.preventDefault();
                                    handleNewChrome(chrome._id);
                                  }}
                                >
                                  <button className={`btn btn-success w-100 ${clicked === chrome._id && "disabled"}`}>
                                    {clicked === chrome._id ? (
                                      <div className="spinner-border spinner-border-sm text-light" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                      </div>
                                    ) : (
                                      "Conseguida"
                                    )}
                                  </button>
                                </form>
                              </div>
                            )}
                          </article>
                        </div>
                      )
                    );
                  })}
                </div>
                <hr />
              </section>
            </div>
            {TEAMS.map((team, i) => (
              <div key={i} className="pt-3">
                <section key={i} id={team} className={`bg-${team.replace(/\s+/g, "-").toLocaleLowerCase()} bg-team rounded shadow`}>
                  <div className="row g-2">
                    <div className="d-flex flex-column position-relative">
                      <hr className="text-light mt-3 w-100 position-absolute" style={{ borderTop: "4px solid #f8f9fa" }} />
                      <h3 className="text-center bg-light px-5 rounded-pill mx-auto fw-bold text-qatar">{team.toUpperCase()}</h3>
                    </div>
                    {chromes
                      ?.filter((chrome) => chrome.section === team)
                      .map((chrome, i) => (
                        <div key={chrome._id} className="col-lg-2 col-md-3 col-6">
                          <article className={`bg-secondary mx-auto rounded ${userChromes?.includes(chrome._id) ? "bg-success" : "bg-danger"}`} style={{ height: "200px", width: "133px" }}>
                            {userChromes?.includes(chrome._id) ? (
                              <div className="d-flex flex-column h-100">
                                {repeatedChromes?.map((repeat, i) => {
                                  return (
                                    repeat.chrome === chrome._id && (
                                      <div key={i} className="bg-warning text-center fw-bold">
                                        REPETIDA
                                      </div>
                                    )
                                  );
                                })}
                                <div className="fs-3 text-light fw-bold m-auto">{chrome.name}</div>
                                {repeatedChromes?.filter((rep) => rep.chrome === chrome._id).length > 0 ? (
                                  <>
                                    {repeatedChromes.map((repeat, i) => {
                                      return (
                                        repeat.chrome === chrome._id && (
                                          <div key={i} className="d-flex bg-warning text-center align-items-center rounded-bottom">
                                            {clicked === chrome._id ? (
                                              <button className={`btn btn-sm btn-qatar rounded-bottom w-100 ${clicked === chrome._id && "disabled"}`}>
                                                <div className="spinner-border spinner-border-sm text-light" role="status">
                                                  <span className="visually-hidden">Loading...</span>
                                                </div>
                                              </button>
                                            ) : (
                                              <>
                                                <button onClick={() => handleRemoveChrome(chrome._id)} className="btn btn-sm btn-qatar chrome-down">
                                                  -1
                                                </button>
                                                <div className="mx-auto fw-bold">X{repeat.quantity}</div>
                                                <button onClick={() => handleNewChrome(chrome._id)} className="btn btn-sm btn-qatar chrome-up">
                                                  +1
                                                </button>
                                              </>
                                            )}
                                          </div>
                                        )
                                      );
                                    })}
                                  </>
                                ) : (
                                  <button onClick={() => handleNewChrome(chrome._id)} className={`btn btn-sm btn-qatar rounded-bottom w-100 ${clicked === chrome._id && "disabled"}`}>
                                    {clicked === chrome._id ? (
                                      <div className="spinner-border spinner-border-sm text-light" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                      </div>
                                    ) : (
                                      "Agregar 1"
                                    )}
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div className="d-flex flex-column h-100">
                                <div className="fs-3 text-light fw-bold m-auto">{chrome.name}</div>
                                <form
                                  onSubmit={(e) => {
                                    e.preventDefault();
                                    handleNewChrome(chrome._id);
                                  }}
                                >
                                  <button className={`btn btn-success w-100 ${clicked === chrome._id && "disabled"}`}>
                                    {clicked === chrome._id ? (
                                      <div className="spinner-border spinner-border-sm text-light" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                      </div>
                                    ) : (
                                      "Conseguida"
                                    )}
                                  </button>
                                </form>
                              </div>
                            )}
                          </article>
                        </div>
                      ))}
                  </div>
                  <hr />
                </section>
              </div>
            ))}
            <div className="py-3">
              <section id="fwc-2" className="bg-qatar bg-team rounded shadow pb-3">
                <div className="row g-2">
                  <div className="d-flex flex-column position-relative">
                    <hr className="text-light mt-3 w-100 position-absolute" style={{ borderTop: "4px solid #f8f9fa" }} />
                    <h3 className="text-center bg-light px-5 rounded-pill mx-auto fw-bold text-qatar">
                      FWC <small>(segunda parte)</small>
                    </h3>
                  </div>
                  {chromes?.map((chrome, i) => {
                    return (
                      i > 626 && (
                        <div key={chrome._id} className="col-lg-2 col-md-3 col-6">
                          <article className={`bg-secondary mx-auto rounded ${userChromes?.includes(chrome._id) ? "bg-success" : "bg-danger"}`} style={{ height: "200px", width: "133px" }}>
                            {userChromes?.includes(chrome._id) ? (
                              <div className="d-flex flex-column h-100">
                                {repeatedChromes?.map((repeat, i) => {
                                  return (
                                    repeat.chrome === chrome._id && (
                                      <div key={i} className="bg-warning text-center fw-bold">
                                        REPETIDA
                                      </div>
                                    )
                                  );
                                })}
                                <div className="fs-3 text-light fw-bold m-auto">{chrome.name}</div>
                                {repeatedChromes?.filter((rep) => rep.chrome === chrome._id).length > 0 ? (
                                  <>
                                    {repeatedChromes.map((repeat, i) => {
                                      return (
                                        repeat.chrome === chrome._id && (
                                          <div key={i} className="d-flex bg-warning text-center align-items-center rounded-bottom">
                                            {clicked === chrome._id ? (
                                              <button className={`btn btn-sm btn-qatar rounded-bottom w-100 ${clicked === chrome._id && "disabled"}`}>
                                                <div className="spinner-border spinner-border-sm text-light" role="status">
                                                  <span className="visually-hidden">Loading...</span>
                                                </div>
                                              </button>
                                            ) : (
                                              <>
                                                <button onClick={() => handleRemoveChrome(chrome._id)} className="btn btn-sm btn-qatar chrome-down">
                                                  -1
                                                </button>
                                                <div className="mx-auto fw-bold">X{repeat.quantity}</div>
                                                <button onClick={() => handleNewChrome(chrome._id)} className="btn btn-sm btn-qatar chrome-up">
                                                  +1
                                                </button>
                                              </>
                                            )}
                                          </div>
                                        )
                                      );
                                    })}
                                  </>
                                ) : (
                                  <button onClick={() => handleNewChrome(chrome._id)} className={`btn btn-sm btn-qatar rounded-bottom w-100 ${clicked === chrome._id && "disabled"}`}>
                                    {clicked === chrome._id ? (
                                      <div className="spinner-border spinner-border-sm text-light" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                      </div>
                                    ) : (
                                      "Agregar 1"
                                    )}
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div className="d-flex flex-column h-100">
                                <div className="fs-3 text-light fw-bold m-auto">{chrome.name}</div>
                                <form
                                  onSubmit={(e) => {
                                    e.preventDefault();
                                    handleNewChrome(chrome._id);
                                  }}
                                >
                                  <button className={`btn btn-success w-100 ${clicked === chrome._id && "disabled"}`}>
                                    {clicked === chrome._id ? (
                                      <div className="spinner-border spinner-border-sm text-light" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                      </div>
                                    ) : (
                                      "Conseguida"
                                    )}
                                  </button>
                                </form>
                              </div>
                            )}
                          </article>
                        </div>
                      )
                    );
                  })}
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default UserChromes;
