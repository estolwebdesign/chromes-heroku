import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { API } from "../../../Global";
import useForm from "../../../Hooks/useForm";

const ResetForm = ({ token }) => {
  const navigate = useNavigate();
  const [resetPassForm, handleFormChange] = useForm({
    password: "",
    passRepeat: "",
  });

  const { password, passRepeat } = resetPassForm;

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

    fetch(`${API}/auth/set-new-password/${token}`, requestOptions)
      .then(async (res) => {
        Swal.fire("Contraseña reseteada", "El proceso de cambio de contraseña ha sido exitoso, ya puedes ingresar nuevamente a tu cuenta de ChromeSwapp", "success");
        navigate("/sign");
      })
      .catch((err) => {
        Swal.fire("Error", err?.request.response, "error");
        console.error(err);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-light rounded p-3 shadow mt-3">
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
    </form>
  );
};

export default ResetForm;
