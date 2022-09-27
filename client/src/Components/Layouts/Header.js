import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import UserContext from "../../Context/UserContext";
import { API, PRODUCTION_API } from "../../Global";
import Swal from "sweetalert2";

const Header = () => {
  const { user, setUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleSignOut = () => {
    const requestOptions = {
      method: "POST",
      credentials: "include",
    };

    fetch(`${API}/auth/sign-out`, JSON.stringify(requestOptions)
      .then(async (res) => {
        localStorage.removeItem("user");
        setUser(null);
        Swal.fire({
          text: "Su sesión ha sido cerrada",
          icon: "success",
        });
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-qatar">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          ChromeSwap
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {!user ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/sign-in">
                    Ingresar
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/sign-up">
                    Registrarme
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/search-chromes">
                    Buscar figuritas
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/my-chromes">
                    Mis figuritas
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/my-transactions">
                    Mis intercambios
                  </NavLink>
                </li>
                {user.roles[0] === "ROLE_ADMIN" && (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="admin">
                      Administrar
                    </NavLink>
                  </li>
                )}
                <li className="nav-item">
                  <span role="button" className="nav-link" onClick={handleSignOut}>
                    Cerrar sesión
                  </span>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
