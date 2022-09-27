import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useForm from "../../Hooks/useForm";
import { API, PRODUCTION_API } from "../../Global";
import Swal from "sweetalert2";
import UserContext from "../../Context/UserContext";

const SignUp = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [registerForm, handleFormChange] = useForm({
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

  useEffect(() => {
    if (user) {
      navigate("/");
    }

    return () => {};
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const body = registerForm;

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    };
    
    fetch(`${API}/auth/sign-up`, JSON.stringify(requestOptions))
      .then(async (res) => {
        Swal.fire("Registrado!!", "Te has registrado sactisfactoriamente", "success");
        navigate("/sign-in");
      })
      .catch((err) => {
        Swal.fire("Error", "Ha surgido un problema con tu registro, por favor verifica los datos he itenta nuevamente", "error");
        console.error(err);
      });
  };

  return (
    <main>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-xl-4 col-lg-5 col-md-6 col-sm-8">
            <form onSubmit={handleSubmit} className="bg-light rounded p-3 shadow mt-3">
              <h1 className="text-center">Registrate</h1>
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input type="text" className="form-control" name="name" id="name" value={name} onChange={handleFormChange} />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" className="form-control" name="email" id="email" value={email} onChange={handleFormChange} />
              </div>
              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input type="password" className="form-control" name="password" id="password" value={password} onChange={handleFormChange} />
              </div>
              <div className="form-group">
                <label htmlFor="passwordRepeat">Repetir contraseña</label>
                <input type="password" className="form-control" name="passwordRepeat" id="passwordRepeat" value={passwordRepeat} onChange={handleFormChange} />
              </div>
              <div className="mt-3 text-center">
                <button type="submit" className="btn btn-qatar">
                  Registrarme
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignUp;
