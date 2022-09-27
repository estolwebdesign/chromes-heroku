import React, { useState, useEffect, useContext } from "react";
import { API, PRODUCTION_API } from "../../Global";
import { Link } from "react-router-dom";
import Error from "../Layouts/Error";
import UserContext from "../../Context/UserContext";

const Transactions = () => {
  const [transactions, setTransactions] = useState();
  const { user } = useContext(UserContext);
  const [isAdmin, setIsAdmin] = useState();

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      credentials: "include",
    };

    fetch(`${API}/admin/transactions/get-all`, requestOptions)
      .then(async (res) => {
        const data = await res.json();
        setTransactions(data.transactions);
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
          <div className="container mt-3 bg-light rounded p-3 shadow">
            <div className="d-flex flex-column position-relative w-100">
              <hr className="text-light mt-4 w-100 position-absolute" style={{ borderTop: "4px solid #5c0931" }} />
              <h1 className="text-center bg-qatar px-5 rounded-pill mx-auto fw-bold text-qatar text-light" style={{ zIndex: "1050" }}>
                INTERCAMBIOS
              </h1>
            </div>
            {!transactions ? (
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
                {transactions.length < 1 ? (
                  <div className="text-center">
                    <h3 className="fw-bold">#404</h3>
                    <h3>No hay transacciones registradas</h3>
                  </div>
                ) : (
                  <table className="table table-striped text-center">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">User 1</th>
                        <th scope="col">Figurita 1</th>
                        <th scope="col">User 2</th>
                        <th scope="col">Figurita 2</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions?.map((trans, i) => (
                        <tr key={trans._id}>
                          <th scope="row">{i + 1}</th>
                          <td>{trans.from.username}</td>
                          <td>{trans.chromes.drop ? trans.chromes.drop.name : <small className="fw-bold bg-warning p-1 rounded">Pendiente</small>}</td>
                          <td>{trans.to.username}</td>
                          <td>{trans.chromes.get.name}</td>
                          <td>
                            {trans.accepted ? (
                              <small className="fw-bold bg-primary text-light p-1 rounded">Aceptada</small>
                            ) : trans.cancelled ? (
                              <small className="fw-bold bg-danger text-light p-1 rounded">Cancelada</small>
                            ) : trans.closed ? (
                              <small className="fw-bold bg-success text-light p-1 rounded">Finalizada</small>
                            ) : (
                              <small className="fw-bold bg-warning p-1 rounded">Pendiente</small>
                            )}
                          </td>
                          <td>
                            <Link to={`/admin/transactions/${trans._id}`} className="btn btn-sm btn-info">
                              Ver más
                            </Link>
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

export default Transactions;
