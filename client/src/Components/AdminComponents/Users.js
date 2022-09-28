import React, { useState, useEffect, useContext } from "react";
import { API, PRODUCTION_API } from "../../Global";
import { Link } from "react-router-dom";
import UserContext from "../../Context/UserContext";
import Error from "../Layouts/Error";

const Users = () => {
  const [users, setUsers] = useState();
  const { user } = useContext(UserContext);
  const [isAdmin, setIsAdmin] = useState();

  useEffect(() => {
    const requestOptions = {
      method: "POST",
      credentials: "include",
    };

    fetch(`${API}/users/get-all`, requestOptions)
      .then(async (res) => {
        const data = await res.json();
        setUsers(data.users);
      })
      .catch((err) => {
        if (err.request.status === 404) {
          setUsers([]);
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

  return (
    <>
      {isAdmin ? (
        <main>
          <div className="container mt-3 bg-light rounded p-3">
            <div className="d-flex flex-column position-relative w-100">
              <hr className="text-light mt-4 w-100 position-absolute" style={{ borderTop: "4px solid #5c0931" }} />
              <h1 className="text-center bg-qatar px-5 rounded-pill mx-auto fw-bold text-qatar text-light" style={{ zIndex: "1050" }}>
                USUARIOS REGISTRADOS
              </h1>
            </div>
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
                  <div className="text-center">
                    <h3 className="fw-bold">#404</h3>
                    <h3>No hay usuarios registrados</h3>
                  </div>
                ) : (
                  <table className="table table-striped text-center">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Email</th>
                        <th scope="col">Roles</th>
                        <th scope="col">Figuritas</th>
                        <th scope="col">Repetidas</th>
                        <th scope="col">Transacciones</th>
                        <th scope="col">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, i) => (
                        <tr key={i}>
                          <th scope="row">{i + 1}</th>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>{user.roles[0].name}</td>
                          <td>{user.chromes.length}</td>
                          <td>{user.repeated.length}</td>
                          <td>{user.transactions.length}</td>
                          <td>
                            <div className="btn-group">
                              <Link className="btn btn-sm btn-success" to={`/admin/users/${user._id}`}>
                                Ver usuario
                              </Link>
                              <Link className="btn btn-sm btn-warning" to={`/admin/users/${user._id}/transactions`}>
                                Ver transacciones
                              </Link>
                            </div>
                          </td>
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

export default Users;
