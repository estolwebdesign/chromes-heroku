import React, { useContext, useEffect } from "react";
import UserContext from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import Loader from "../Layouts/Loader";

const UserDashboard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user !== undefined) {
      if (!user) {
        navigate("/sign");
      } else {
        navigate("/search-chromes");
      }
    }

    return () => {};
  }, [user, navigate]);

  return (
    <Loader />
  );
};

export default UserDashboard;
