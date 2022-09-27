import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { API, PRODUCTION_API } from "../../Global";
import useForm from "../../Hooks/useForm";
import { useContext } from "react";
import UserContext from "../../Context/UserContext";

const SignIn = () => {
  const [loginForm, handleFormChange] = useForm({
    email: "",
    password: "",
    lat: "",
    lng: "",
  });

  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const { email, password } = loginForm;

  useEffect(() => {
    if (user) {
      navigate("/");
    }

    return () => {};
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();

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
        localStorage.setItem("user", JSON.stringify(data));
        Swal.fire("Estas dentro!!", "Has iniciado sesión satisfactoriamente en tu cuenta de ChromeSwap. A intercambiar figuritas!!", "success");
        navigate("/");
        setUser(data);
      })
      .catch((err) => {
        Swal.fire("Error", "Ha surgido un problema con el ingreso a tu cuenta, por favor verifica los datos he intenta nuevamente", "error");
        console.error(err);
      });
  };

  return (
    <main>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-xl-4 col-lg-5 col-md-6 col-sm-8">
            <form onSubmit={handleSubmit} className="bg-light rounded p-3 shadow mt-3">
              <h1 className="text-center">Ingresar</h1>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" className="form-control" name="email" id="email" value={email} onChange={handleFormChange} />
              </div>
              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input type="password" className="form-control" name="password" id="password" value={password} onChange={handleFormChange} />
              </div>
              <div className="mt-3 d-flex">
                <Link to={"/forgot-password"} className="me-auto mt-auto">
                  Olvidé mi contraseña
                </Link>
                <button type="submit" className="btn btn-qatar">
                  Ingresar
                </button>
              </div>
              <div className="text-center border p-2 rounded mt-3">
                <h5>¿Aún no estas registrado?</h5>
                <Link to={"/sign-up"} className="btn btn-qatar w-100">
                  Regístrate
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignIn;
