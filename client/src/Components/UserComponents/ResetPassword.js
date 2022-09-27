
import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { API, PRODUCTION_API } from "../../Global";
import useForm from "../../Hooks/useForm";

const ResetPassword = () => {
  const { token } = useParams();
  const [tokenVerified, setTokenVerified] = useState(false);
  const navigate = useNavigate();
  const [resetPassForm, handleFormChange] = useForm({
    password: "",
    passRepeat: "",
  });

  const { password, passRepeat } = resetPassForm;

  useEffect(() => {
    if (token) {
      const requestOptions = {
        method: "GET",
        credentials: "include",
      };

      fetch(`${API}/auth/validate-token/${token}`, JSON.stringify(requestOptions))
        .then(async (res) => {
          const data = await res.json();
          if (data.message === "Token verified successfully.") {
            setTokenVerified(true);
          }
        })
        .catch((err) => {
          Swal.fire("Error!", err?.request.response, "error");
          console.error(err);
        });
    }

    return () => {};
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== passRepeat) {
      return Swal.fire("Atención", "Ambos campos tienen que coinicidir, pero se encontraros discrepancias", "info");
    }

    const body = {
      newPassword: password,
    };

    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    };

    fetch(`${API}/auth/set-new-password/${token}`, JSON.stringify(requestOptions))
      .then(async (res) => {
        Swal.fire("Contraseña reseteada", "El proceso de cambio de contraseña ha sido exitoso, ya puedes ingresar nuevamente a tu cuenta de ChromeSwap", "success");
        navigate("/sign-in");
      })
      .catch((err) => {
        Swal.fire("Error", err?.request.response, "error");
        console.error(err);
      });
  };

  return (
    <main>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-xl-4 col-lg-5 col-md-6 col-sm-8">
            <form onSubmit={handleSubmit} className="bg-light rounded p-3 shadow mt-3">
              {tokenVerified ? (
                <>
                  <h1 className="text-center">Elige tu nueva contraseña</h1>
                  <div className="form-group">
                    <label htmlFor="password">Nueva contraseña</label>
                    <input type="password" className="form-control" name="password" id="password" value={password} onChange={handleFormChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="passRepeat">Repita tu nueva contraseña</label>
                    <input type="password" className="form-control" name="passRepeat" id="passRepeat" value={passRepeat} onChange={handleFormChange} />
                  </div>
                  <div className="mt-3 text-center">
                    <button type="submit" className="btn btn-qatar">
                      Ingresar
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <h1>Validando link</h1>
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
              )}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ResetPassword;
