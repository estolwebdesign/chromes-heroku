import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { API } from "../../../Global";
import useForm from "../../../Hooks/useForm";

const RegisterForm = ({ setAction }) => {
  const navigate = useNavigate();
  const [clicked, setClicked] = useState(false);

  const [registerForm, registerFormChange] = useForm({
    name: "",
    email: "",
    password: "",
    passwordRepeat: "",
    location: {
      lat: "",
      lng: "",
    },
  });

  const { name, email, password, passwordRepeat } = registerForm;

  const handleRegister = (e) => {
    e.preventDefault();
    setClicked(true);

    const body = registerForm;

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    };

    fetch(`${API}/auth/sign-up`, requestOptions)
      .then(async (res) => {
        Swal.fire("Registrado!!", "Te has registrado sactisfactoriamente, ya puedes ingresar con tu correo electrónico y contraseña", "success");
        setAction("log");
      })
      .catch((err) => {
        setClicked(false);
        Swal.fire("Error", "Ha surgido un problema con tu registro, por favor verifica los datos he itenta nuevamente", "error");
        console.error(err);
      });
  };

  return (
    <form onSubmit={handleRegister} className="bg-light rounded p-3 shadow mt-3">
      <h2 className="text-center">Registrate</h2>
      <div className="form-group">
        <label htmlFor="name">Nombre</label>
        <input type="text" className="form-control" name="name" id="name" value={name} onChange={registerFormChange} />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" className="form-control" name="email" id="email" value={email} onChange={registerFormChange} />
      </div>
      <div className="form-group">
        <label htmlFor="password">Contraseña</label>
        <input type="password" className="form-control" name="password" id="password" value={password} onChange={registerFormChange} />
      </div>
      <div className="form-group">
        <label htmlFor="passwordRepeat">Repetir contraseña</label>
        <input type="password" className="form-control" name="passwordRepeat" id="passwordRepeat" value={passwordRepeat} onChange={registerFormChange} />
      </div>
      <div className="mt-3 text-center">
        <button type="submit" className={`btn btn-qatar px-5 ${clicked && "disabled"}`} style={{ minWidth: "196px" }}>
          {!clicked ? (
            "Registrarme"
          ) : (
            <div className="spinner-border spinner-border-sm text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
        </button>
      </div>
      <div className="text-center border p-2 rounded mt-3">
        <h5>¿Ya estás registrado?</h5>
        <button onClick={() => setAction("log")} className="btn btn-qatar w-100">
          Ingresa aquí
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
