
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import UserContext from "../../Context/UserContext";
import { API } from "../../Global";
import Error from "../Layouts/Error";

const Transaction = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState();
  const { user } = useContext(UserContext);
  const [isAdmin, setIsAdmin] = useState();

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      credentials: "include",
    };

    fetch(`${API}/admin/transactions/get-one/${id}`, JSON.stringify(requestOptions))
      .then(async (res) => {
        const data = await res.json();
        setTransaction(data.transaction);
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
            {!transaction ? (
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
                <h1 className="text-center">
                  Transacción <span className="fs-4">#{transaction._id}</span>
                </h1>
                <table className="table table-striped text-center">
                  <tbody>
                    <tr>
                      <th scope="row">_ID</th>
                      <td>{transaction._id}</td>
                    </tr>
                    <tr>
                      <th scope="row">Intercambio iniciado por</th>
                      <td>
                        {transaction.from.username}{" "}
                        <Link to={`/admin/users/${transaction.from._id}`} className="btn btn-sm btn-info ms-4">
                          Ver usuario
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Intercambio recibido por</th>
                      <td>
                        {transaction.to.username}{" "}
                        <Link to={`/admin/users/${transaction.to._id}`} className="btn btn-sm btn-info ms-4">
                          Ver usuario
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Figurita a recibir por {transaction.from.username}</th>
                      <td>{transaction.chromes.get.name}</td>
                    </tr>
                    <tr>
                      <th scope="row">Figurita a recibir por {transaction.to.username}</th>
                      <td>{transaction.chromes.drop ? transaction.chromes.drop.name : <span className="fw-bold bg-warning">Pendiente</span>}</td>
                    </tr>
                    <tr>
                      <th scope="row">Estado de la transacción</th>
                      <td>
                        {transaction.accepted ? (
                          <span className="fw-bold bg-primary text-light">Aceptada</span>
                        ) : transaction.cancelled ? (
                          <span className="fw-bold bg-danger text-light">Cancelada</span>
                        ) : transaction.closed ? (
                          <span className="fw-bold bg-success text-light">Finalizada</span>
                        ) : (
                          <span className="fw-bold bg-warning">Pendiente</span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
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

export default Transaction;
