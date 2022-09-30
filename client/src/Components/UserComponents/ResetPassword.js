import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { API } from "../../Global";
import Loader from "../Layouts/Loader";
import ResetForm from "./ResetPasswordComponents/ResetForm";

const ResetPassword = () => {
  const { token } = useParams();
  const [tokenVerified, setTokenVerified] = useState(false);

  useEffect(() => {
    if (token) {
      const requestOptions = {
        method: "POST",
        credentials: "include",
      };

      fetch(`${API}/auth/validate-token/${token}`, requestOptions)
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

  return (
    <main>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-xl-4 col-lg-5 col-md-6 col-sm-8">
            {tokenVerified ? (
              <ResetForm token={token} />
            ) : (
              <div className="text-center bg-light rounded shadow p-3">
                <h1>Validando link</h1>
                <Loader />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ResetPassword;
