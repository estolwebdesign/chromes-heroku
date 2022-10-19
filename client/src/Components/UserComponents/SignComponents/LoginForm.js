import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import UserContext from "../../../Context/UserContext";
import { API } from "../../../Global";
import useForm from "../../../Hooks/useForm";

const LoginForm = ({ setAction }) => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [clicked, setClicked] = useState(false);

  const [loginForm, loginFormChange] = useForm({
    email: "",
    password: "",
    lat: "",
    lng: "",
  });

  const { email: logEmail, password: logPassword } = loginForm;

  const handleSignIn = (e) => {
    e.preventDefault();

    setClicked(true);

    const body = loginForm;

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    };

    fetch(`${API}/auth/sign-in`, requestOptions)
      .then(async (res) => {
        const data = await res.json();
        if (data.message === "User Not found.") {
          Swal.fire("Error", `No existe usuario registrado con el email "${logEmail}".`, "error");
          return console.warn(data.message);
        }
        localStorage.setItem("user", JSON.stringify(data));
        Swal.fire("Estas dentro!!", "Has iniciado sesión satisfactoriamente en tu cuenta de ChromeSwapp. A intercambiar figuritas!!", "success");
        navigate("/");
        setUser(data);
      })
      .catch((err) => {
        setClicked(false);
        Swal.fire("Error", "Ha surgido un problema con el ingreso a tu cuenta, por favor verifica los datos he intenta nuevamente", "error");
        console.error(err);
      });
  };

  return (
    <form onSubmit={handleSignIn} className="bg-light rounded p-3 shadow mt-3">
      <h2 className="text-center">Ingresar</h2>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" className="form-control" name="email" id="email" value={logEmail} onChange={loginFormChange} />
      </div>
      <div className="form-group">
        <label htmlFor="password">Contraseña</label>
        <input type="password" className="form-control" name="password" id="password" value={logPassword} onChange={loginFormChange} />
      </div>
      <div className="mt-3 d-flex">
        <Link to={"/forgot-password"} className="me-auto mt-auto">
          <small>Olvidé mi contraseña</small>
        </Link>
        <button type="submit" className={`btn btn-qatar ${clicked && "disabled"}`} style={{minWidth: "161px"}}>
          {!clicked ? (
            "Ingresar"
          ) : (
            <div className="spinner-border spinner-border-sm text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
        </button>
      </div>
      <div className="text-center border p-2 rounded mt-3">
        <h5>¿Aún no estás registrado?</h5>
        <button onClick={() => setAction("register")} className="btn btn-qatar-lg fw-bold w-100">
          Regístrate aquí
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
