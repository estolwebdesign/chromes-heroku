import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import { API } from "../../../Global";
import useForm from "../../../Hooks/useForm";
import ReCAPTCHA from "react-google-recaptcha";
import { diff_years } from "../../../helpers/diff_years";
import moment from "moment";

const RegisterForm = ({ setAction }) => {
  const [clicked, setClicked] = useState(false);
  const [validCaptcha, setValidCaptcha] = useState(null);
  const captcha = useRef(null);

  const [registerForm, registerFormChange] = useForm({
    name: "",
    email: "",
    password: "",
    passwordRepeat: "",
    birth: "",
    location: {
      lat: "",
      lng: "",
    },
  });

  const { name, email, password, passwordRepeat, birth } = registerForm;

  const handleRegister = (e) => {
    e.preventDefault();
    if (!validCaptcha) {
      console.warn("Atención: captcha inválido");
    }

    const age = diff_years(new Date(moment(birth).format("YYYY/MM/D")), new Date(moment().format("YYYY/MM/D")));

    if (age < 18) {
      return Swal.fire(
        "Atención",
        "Por tu seguridad, no puedes registrarte en ChromeSwapp porque eres menor de edad",
        "info"
      );
    }

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
        Swal.fire(
          "Registrado!!",
          "Te has registrado sactisfactoriamente, ya puedes ingresar con tu correo electrónico y contraseña",
          "success"
        );
        setAction("log");
      })
      .catch((err) => {
        setClicked(false);
        Swal.fire(
          "Error",
          "Ha surgido un problema con tu registro, por favor verifica los datos he itenta nuevamente",
          "error"
        );
        console.error(err);
      });
  };

  const captchaChange = () => {
    if (captcha.current.getValue()) {
      setValidCaptcha(captcha.current.getValue());
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="bg-light rounded p-3 shadow mt-3"
    >
      <h2 className="text-center">Registrate</h2>
      <div className="form-group">
        <label htmlFor="name">Nombre</label>
        <input
          type="text"
          className="form-control"
          name="name"
          id="name"
          value={name}
          onChange={registerFormChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          className="form-control"
          name="email"
          id="email"
          value={email}
          onChange={registerFormChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          className="form-control"
          name="password"
          id="password"
          value={password}
          onChange={registerFormChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="passwordRepeat">Repetir contraseña</label>
        <input
          type="password"
          className="form-control"
          name="passwordRepeat"
          id="passwordRepeat"
          value={passwordRepeat}
          onChange={registerFormChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="birth">Fecha de nacimiento</label>
        <input
          type="date"
          className="form-control"
          name="birth"
          id="birth"
          value={birth}
          onChange={registerFormChange}
        />
      </div>
      <div className="mt-3 text-center">
        <div className="d-flex justify-content-center">
          <ReCAPTCHA
            ref={captcha}
            sitekey="6LdwqYAiAAAAANg7uU026ygVqkJ-svR1D7FgvLD3"
            onChange={captchaChange}
          />
        </div>
        {validCaptcha && (
          <button
            type="submit"
            className={`btn btn-qatar px-5 ${
              clicked && "disabled"
            } animate__animated animate__fadeInDown mt-3`}
            style={{ minWidth: "196px" }}
          >
            {!clicked ? (
              "Registrarme"
            ) : (
              <div
                className="spinner-border spinner-border-sm text-light"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
          </button>
        )}
      </div>
      <div className="text-center border p-2 rounded mt-3">
        <h5>¿Ya estás registrado?</h5>
        <button
          onClick={() => setAction("log")}
          className="btn btn-qatar-lg fw-bold w-100"
        >
          Ingresa aquí
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
