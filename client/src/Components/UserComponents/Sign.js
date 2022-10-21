import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../../Context/UserContext";
import LoginForm from "./SignComponents/LoginForm";
import RegisterForm from "./SignComponents/RegisterForm";
import Greeting from "./SignComponents/Greeting";

const Sign = () => {
  const { state } = useLocation();
  const [action, setAction] = useState("log");
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {

    if (state?.register === true) {
      setAction("register");
    }

    return () => {};
    // eslint-disable-next-line
  }, [state]);

  useEffect(() => {
    if (user) {
      navigate("/");
    }

    return () => {};
  }, [user, navigate]);

  return (
    <main className="mb-5">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-md-6 col-sm-8 order-md-0 order-1">
            <Greeting />
          </div>
          <div className="col-xl-4 col-lg-5 col-md-6 col-sm-8 order-md-1 order-0">
            {action === "log" && <LoginForm setAction={setAction} />}
            {action === "register" && <RegisterForm setAction={setAction} />}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Sign;
