import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import UserContext from "../../Context/UserContext";
import { API, PRODUCTION_API } from "../../Global";

const SearchChromes = () => {
  const { user, setUser } = useContext(UserContext);
  const [users, setUsers] = useState();
  const navigate = useNavigate();

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      const body = {
        lat: latitude.toString(),
        lng: longitude.toString(),
      };

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      };

      fetch(`${API}/auth/check-signed`, requestOptions)
        .then(async (res) => {
          const data = await res.json();
          if (data.id) {
            setUser(data);
          }
          if (data.message === "jwt expired") {
            Swal.fire({
              title: "Su sesión ha expirado",
              icon: "warning",
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }

    return () => {};
  }, [latitude, longitude]);

  useEffect(() => {
    if (user) {
      const requestOptions = {
        method: "GET",
        credentials: "include",
      };

      fetch(`${API}/users/get-nearest/${user.id}/5000`, requestOptions)
        .then(async (res) => {
          const data = await res.json();
          setUsers(data.users);
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

  const handleNewTransaction = async (chrome, usr) => {
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
          `Has iniciado el intercambio con el usuario ${data.transaction.to.username}. Ahora deberás aguardar a que ${data.transaction.to.username} elija una de tus figuritas repetidas, y luego podrás aceptar o cancelar el intercambio.`,
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
            FIGURITAS CERCANAS
          </h1>
          {!users ? (
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
              {users.length < 1 ? (
                <div className="mt-3">
                  <p className="fs-3 mb-0 text-center fw-bold">Lo sentimos</p>
                  <p className="fs-3 mb-0 text-center">No se encontraron usuarios cercanos</p>
                </div>
              ) : (
                <div className="row g-2 justify-content-center">
                  {users.map((usr, i) => {
                    return usr.repeated.map((repeat, i) => {
                      return (
                        !user?.chromes.includes(repeat.chrome._id) && (
                          <div key={i} className="col-lg-2 col-md-3 col-6">
                            <article
                              className={`bg-secondary mx-auto rounded shadow ${user?.chromes.includes(repeat.chrome._id) ? "bg-danger" : "bg-success"}`}
                              style={{ height: "200px", width: "133px" }}
                            >
                              <div className="d-flex flex-column h-100">
                                <div className="fs-3 text-light fw-bold m-auto">{repeat.chrome.name}</div>
                                {!user?.chromes.includes(repeat.chrome._id) && (
                                  <form
                                    onSubmit={(e) => {
                                      e.preventDefault();
                                      handleNewTransaction(repeat.chrome._id, usr._id);
                                    }}
                                  >
                                    <button className="btn btn-qatar w-100">Soilicitar intercambio</button>
                                  </form>
                                )}
                              </div>
                            </article>
                          </div>
                        )
                      );
                    });
                  })}
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
