import React, { useContext, useEffect } from "react";
import UserContext from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user !== undefined) {
      if (!user) {
        navigate("/sign-in");
      } else {
        navigate("/search-chromes");
      }
    }

    return () => {};
  }, [user, navigate]);

  return (
    <div className="text-center">
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
  );
};

export default UserDashboard;
