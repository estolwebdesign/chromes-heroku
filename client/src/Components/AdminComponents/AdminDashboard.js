import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { API, PRODUCTION_API } from "../../Global";
import UserContext from "../../Context/UserContext";
import Error from "../Layouts/Error";

const AdminDashboard = () => {
  const [usersCount, setUsersCount] = useState();
  const [chromesCount, setChromesCount] = useState();
  const { user } = useContext(UserContext);
  const [isAdmin, setIsAdmin] = useState();

  useEffect(() => {
    const requestOptions = {
      method: "POST",
      credentials: "include",
    };

    fetch(`${API}/users/count`, requestOptions)
      .then(async (res) => {
        const data = await res.json();
        setUsersCount(data.usersCount);
      })
      .catch((err) => {
        console.error(err);
      });

    fetch(`${API}/users/chromes-count`, requestOptions)
      .then(async (res) => {
        const data = await res.json();
        setChromesCount({
          chromes: data.chromes,
          repeated: data.repeated,
        });
      })
      .catch((err) => {
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

  return (
    <>
      {isAdmin ? (
        <main>
          <div className="container bg-light rounded p-3 shadow mt-3">
            <div className="d-flex flex-column position-relative">
              <hr className="text-light mt-4 w-100 position-absolute" style={{ borderTop: "4px solid #5c0931" }} />
              <h1 className="text-center bg-qatar px-5 rounded-pill mx-auto fw-bold text-qatar text-light" style={{ zIndex: "1050" }}>
                PANEL ADMINISTRADOR
              </h1>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="row g-3">
                  <div className="col-12">
                    <Link className="btn btn-success w-100 fs-1 d-flex align-items-center justify-content-center" style={{ minHeight: "150px" }} to={"/admin/chromes"}>
                      <span>Figuritas</span>
                    </Link>
                  </div>
                  <div className="col-12">
                    <Link className="btn btn-warning w-100 fs-1 d-flex align-items-center justify-content-center" style={{ minHeight: "150px" }} to={"/admin/transactions"}>
                      <span>Intercambios</span>
                    </Link>
                  </div>
                  <div className="col">
                    <Link className="btn btn-danger w-100 fs-1 d-flex align-items-center justify-content-center" style={{ minHeight: "150px" }} to={"/admin/users"}>
                      <span>Usuarios</span>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <section id="statics" className="border rounded p-3">
                  <h3 className="text-center">Estadisticas</h3>
                  <hr />
                  <table className="table table-striped text-center">
                    <tbody>
                      <tr>
                        <td width="75%">Usuarios registrados</td>
                        <td>
                          {!usersCount ? (
                            <div className="spinner-border spinner-border-sm text-primary" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          ) : (
                            usersCount
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Figuritas registradas sin repetir</td>
                        <td>
                          {!chromesCount ? (
                            <div className="spinner-border spinner-border-sm text-primary" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          ) : (
                            chromesCount.chromes
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Figuritas repetidas para intercambiar</td>
                        <td>
                          {!chromesCount ? (
                            <div className="spinner-border spinner-border-sm text-primary" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          ) : (
                            chromesCount.repeated
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </section>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <Error code={401} />
      )}
    </>
  );
};

export default AdminDashboard;
