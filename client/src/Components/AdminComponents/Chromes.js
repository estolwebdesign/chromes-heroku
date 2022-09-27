import React, { useContext, useEffect, useState } from "react";
import { API, PRODUCTION_API } from "../../Global";
import { Link } from "react-router-dom";
import UserContext from "../../Context/UserContext";
import Error from "../Layouts/Error";

const Chromes = () => {
  const [chromes, setChromes] = useState();
  const { user } = useContext(UserContext);
  const [isAdmin, setIsAdmin] = useState();

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      credentials: "include",
    };

    fetch(`${API}/chromes/get-all`, JSON.stringify(requestOptions)
      .then(async (res) => {
        const data = await res.json();
        setChromes(data.chromes);
      })
      .catch((err) => {
        if (err.request.status === 404) {
          setChromes([]);
        }
        console.error(err);
      });

    return () => {};
  }, []);

  useEffect(() => {
    if (user?.roles[0] === "ROLE_ADMIN") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }

    return () => {};
  }, [user]);

  const handleAddChromes = () => {
    const requestOptions = {
      method: "GET",
      credentials: "include",
    };

    fetch(`${API}/chromes/create-all`, JSON.stringify(requestOptions).catch((err) => {
      console.error(err);
    });
  };

  return (
    <>
      {isAdmin ? (
        <main>
          <div className="container bg-light rounded shadow mt-3 p-3">
            <div className="d-flex flex-column position-relative w-100">
              <hr className="text-light mt-4 w-100 position-absolute" style={{ borderTop: "4px solid #5c0931" }} />
              <h1 className="text-center bg-qatar px-5 rounded-pill mx-auto fw-bold text-qatar text-light" style={{ zIndex: "1050" }}>
                PANEL ADMINISTRADOR
              </h1>
            </div>
            {!chromes ? (
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
                {chromes.length < 1 ? (
                  <>
                    <div className="text-end">
                      <button onClick={handleAddChromes} className="btn btn-success fw-bold rounded-circle shadow">
                        +
                      </button>
                    </div>
                    <div className="text-center">
                      <h3 className="fw-bold">#404</h3>
                      <h3>No hay figuritas registradas</h3>
                    </div>
                  </>
                ) : (
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Identificador</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chromes.map((chrome, i) => (
                        <tr key={i}>
                          <th scope="row">{i + 1}</th>
                          <td>{chrome.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}
          </div>
        </main>
      ) : (
        <Error code={401} />
      )}
    </>
  );
};

export default Chromes;
