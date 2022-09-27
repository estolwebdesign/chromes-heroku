import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { API, PRODUCTION_API } from "../../Global";
import useForm from "../../Hooks/useForm";

const ForgotPassword = () => {
  const [forgotFormValues, handleFormChange] = useForm({
    email: "",
  });

  const { email } = forgotFormValues;

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const body = {
      email: email,
    };

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    };

    fetch(`${API}/auth/forgot-password`, requestOptions)
      .then(async (res) => {
        Swal.fire("Solicitud ingresada", "Su solicitud de cambio de contraseña ha sido ingresada y le ha sido enviado un correo electronico con un link para ingresar una nueva contraseña", "success");
        navigate("/sign-in");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <main>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-xl-4 col-lg-5 col-md-6 col-sm-8">
            <form onSubmit={handleSubmit} className="bg-light rounded p-3 shadow mt-3">
              <h1 className="text-center">¿Olvidaste tu contraseña?</h1>
              <p className="text-center p-2 mb-2 border rounded">Ingresa el correo electrónico con el que te registraste, y te enviaremos un link para que puedas elegir una nueva contraseña</p>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" className="form-control" name="email" id="email" value={email} onChange={handleFormChange} />
              </div>
              <div className="mt-3 text-center">
                <button type="submit" className="btn btn-qatar">
                  Recuperar contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
