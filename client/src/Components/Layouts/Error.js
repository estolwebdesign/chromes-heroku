import React from "react";

const Error = ({ code }) => {
  return (
    <main>
      <div className="container bg-light rounded shadow p-3 mt-3 text-center">
        <h1>Error</h1>
        <h3 className="fw-bold">#{code}</h3>
        <p>
          Mensaje:{" "}
          {code === 404 ? (
            <span>La página a la que estás intentando acceder no existe</span>
          ) : (
            code === 401 && <span>No tienes autorización para ingresar a la página a la que estás intentnando acceder</span>
          )}
        </p>
      </div>
    </main>
  );
};

export default Error;
