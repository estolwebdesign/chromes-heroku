import { faLocationPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import UserContext from "../../Context/UserContext";
import { API } from "../../Global";
import Loader from "../Layouts/Loader";

const SearchChromes = () => {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState();
  const [sorted, setSorted] = useState(false);
  const navigate = useNavigate();
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [searchDistance, setSearchDistance] = useState("5000");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (latitude && longitude && user?.id) {
      const body = {
        lat: latitude.toString(),
        lng: longitude.toString(),
      };

      const requestOptions = {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      };

      fetch(`${API}/users/get-nearest/${parseInt(searchDistance)}/${user.id}`, requestOptions)
        .then(async (res) => {
          const data = await res.json();
          setUsers(data.users);
        })
        .catch((err) => {
          console.error(err);
        });
    }

    if (latitude && longitude && user === null) {
      const body = {
        lat: latitude.toString(),
        lng: longitude.toString(),
      };

      const requestOptions = {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      };

      fetch(`${API}/users/get-nearest/${parseInt(searchDistance)}`, requestOptions)
        .then(async (res) => {
          const data = await res.json();
          setUsers(data.users);
        })
        .catch((err) => {
          console.error(err);
        });
    }

    return () => {};
    // eslint-disable-next-line
  }, [latitude, longitude, searchDistance]);

  const handleNewTransaction = async (chrome, usr) => {
    if (!user) {
      Swal.fire("Registrate", "Para iniciar un intercambio necesitamos que te registres", "info");
      return navigate("/sign", { state: { register: true } });
    }

    const body = {
      from: user.id,
      to: usr,
      chromes: {
        get: chrome,
        drop: null,
      },
    };

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    };

    fetch(`${API}/transactions/create`, requestOptions)
      .then(async (res) => {
        const data = await res.json();
        Swal.fire(
          "Intercambio iniciado",
          `Has iniciado el intercambio con el usuario ${data.transaction?.to.username}. Ahora deberás aguardar a que ${data.transaction?.to.username} elija una de tus figuritas repetidas, y luego podrás aceptar o cancelar el intercambio.`,
          "success"
        );
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (users?.length > 1 && !sorted) {
      users.sort((a, b) => (a.distance > b.distance ? 1 : -1));
      setSorted(true);
    }
    if (users?.length === 1 && !sorted) {
      setSorted(true);
    }

    return () => {};
  }, [users, sorted]);

  return (
    <main className="mb-5">
      <div className="container bg-light rounded shadow p-3 mt-3">
        <div className="d-flex flex-column position-relative w-100">
          <hr className="text-light mt-4 w-100 position-absolute" style={{ borderTop: "4px solid #5c0931" }} />
          <h1 className="text-center bg-qatar px-5 rounded-pill mx-auto fw-bold text-qatar text-light" style={{ zIndex: "1050" }}>
            FIGURITAS CERCANAS
          </h1>
          <div id="distance-select" class="form-floating ms-auto mb-3">
            <select name="searchDistance" class="form-select" id="searchDistance" onChange={({ target }) => setSearchDistance(target.value)}>
              <option value={"500"}>500 mts</option>
              <option value={"1000"}>1 Km</option>
              <option value={"2000"}>2 Km</option>
              <option selected value={"5000"}>
                5 Km
              </option>
              <option value={"10000"}>10 Km</option>
            </select>
            <label for="searchDistance">Radio de búsqueda</label>
          </div>
          {!users ? (
            <Loader />
          ) : (
            <>
              {users.length < 1 ? (
                <div className="mt-3">
                  <p className="fs-3 mb-0 text-center fw-bold">Lo sentimos</p>
                  <p className="fs-3 mb-0 text-center">No se encontraron usuarios cercanos</p>
                </div>
              ) : (
                <div>
                  {sorted &&
                    users.map((usr, i) => (
                      <section key={i} id={usr._id} className="border rounded p-3 mb-3 shadow">
                        <div id="user-header" className="mb-2">
                          <div className="row">
                            <div className="col-lg-4 order-lg-0 order-2 d-flex">
                              {usr.rating ? (
                                <div className="m-auto d-flex">
                                  <span className="my-auto me-2">Valoración: </span>
                                  {[...Array(parseInt(usr.rating.toFixed(1).split(".")[0]))].map((star, index) => {
                                    index += 1;
                                    return (
                                      <span key={index} className="star on fs-2" style={{ textShadow: "none" }}>
                                        &#9733;
                                      </span>
                                    );
                                  })}
                                  {parseInt(usr.rating.toFixed(1).split(".")[1]) > 0 && (
                                    <span
                                      className="star fs-2"
                                      style={{
                                        backgroundImage: `linear-gradient(90deg, #ffd000 ${parseInt(usr.rating?.toString().split(".")[1]) * 10}%, #b9b9b9 ${
                                          100 - parseInt(usr.rating?.toString().split(".")[1]) * 10
                                        }%)`,
                                        color: "transparent",
                                        WebkitBackgroundClip: "text",
                                        MozBackgroundClip: "text",
                                        backgroundClip: "text",
                                      }}
                                    >
                                      &#9733;
                                    </span>
                                  )}
                                  {parseInt(usr.rating.toFixed(1).split(".")[0]) < 4 &&
                                    [...Array(4 - parseInt(usr.rating.toString().split(".")[0]))].map((star, index) => {
                                      index += 1;
                                      return (
                                        <span key={index} className="star off fs-2" style={{ textShadow: "none" }}>
                                          &#9733;
                                        </span>
                                      );
                                    })}
                                  {parseInt(usr.rating.toFixed(1).split(".")[0]) < 5 && parseInt(usr.rating.toFixed(1).split(".")[1]) === 0 && (
                                    <span className="star off fs-2" style={{ textShadow: "none" }}>
                                      &#9733;
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <h6 className="m-auto">No tiene valoraciones aún</h6>
                              )}
                            </div>
                            <div className="col-lg-4 order-lg-1 order-1 d-flex">
                              <h2 className="fw-bold m-auto text-qatar">{usr.username.split(/\s+/)[0].toUpperCase()}</h2>
                            </div>
                            <div className="col-lg-4 order-lg-2 order-0 d-flex">
                              <div className="ms-lg-auto mx-auto my-auto" style={{ height: "24px" }}>
                                <span style={{ height: "24px" }} className="ms-auto">
                                  Distancia:{" "}
                                  {usr.distance < 300 ? "Menos de 300 mts" : usr.distance < 1000 ? `${(usr.distance / 1000).toFixed(1) * 1000} Mts` : `${(usr.distance / 1000).toFixed(1)} Kms`}{" "}
                                  <FontAwesomeIcon icon={faLocationPin} />
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row g-2 justify-content-center">
                          {usr.repeated.map((repeat, i) => {
                            return (
                              !user?.chromes.includes(repeat.chrome._id) && (
                                <div key={i} className="col-lg-2 col-md-3 col-sm-4 col-6">
                                  <article
                                    className={`bg-secondary mx-auto rounded shadow ${user?.chromes.includes(repeat.chrome._id) ? "bg-danger" : "bg-success"}`}
                                    style={{ height: "200px", width: "133px" }}
                                  >
                                    <div className="d-flex flex-column h-100">
                                      <div className="fs-3 text-light fw-bold m-auto">{repeat.chrome.name}</div>
                                      <form
                                        onSubmit={(e) => {
                                          e.preventDefault();
                                          handleNewTransaction(repeat.chrome._id, usr._id);
                                        }}
                                      >
                                        <button className="btn btn-qatar w-100">Intercambiar</button>
                                      </form>
                                    </div>
                                  </article>
                                </div>
                              )
                            );
                          })}
                        </div>
                      </section>
                    ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default SearchChromes;
