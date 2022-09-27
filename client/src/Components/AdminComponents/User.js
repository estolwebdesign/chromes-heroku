
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserContext from "../../Context/UserContext";
import { API, PRODUCTION_API } from "../../Global";
import Error from "../Layouts/Error";

const User = () => {
  const { id } = useParams();
  const [usr, setUsr] = useState();
  const { user } = useContext(UserContext);
  const [isAdmin, setIsAdmin] = useState();

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      credentials: "include",
    };

    fetch(`${API}/users/get-one/${id}`, requestOptions)
      .then(async (res) => {
        const data = await res.json();
        setUsr(data.user);
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
            {!usr ? (
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
              <div>
                <h1 className="text-center">
                  Usuario: <span>{usr.username}</span>
                </h1>
                <table className="table table-striped text-center">
                  <tbody>
                    <tr>
                      <th scope="row">_ID</th>
                      <td>{usr._id}</td>
                    </tr>
                    <tr>
                      <th scope="row">Nombre</th>
                      <td>{usr.username}</td>
                    </tr>
                    <tr>
                      <th scope="row">Email</th>
                      <td>{usr.email}</td>
                    </tr>
                    <tr>
                      <th scope="row">Rol de usuario</th>
                      <td>{usr.roles[0].name}</td>
                    </tr>
                    <tr>
                      <th scope="row">Última ubicación</th>
                      <td>
                        Lat: <span>{usr.location.lat}</span>, Lng: <span>{usr.location.lng}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      ) : (
        <Error code={401} />
      )}
    </>
  );
};

export default User;
