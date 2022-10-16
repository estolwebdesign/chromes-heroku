import React, { useContext, useLayoutEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import UserContext from "../../Context/UserContext";
import { API } from "../../Global";
import Swal from "sweetalert2";
import logo from "../../chromeswap-logo.png";

const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const [winWidth, setWinWidth] = useState(0);

  const navigate = useNavigate();

  const handleSignOut = () => {
    const requestOptions = {
      method: "POST",
      credentials: "include",
    };

    fetch(`${API}/auth/sign-out`, requestOptions)
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

  const handleNavbarToggle = () => {
    setIsCollapsing(true);
    setTimeout(() => {
      setIsCollapsing(false);
      setIsCollapsed(!isCollapsed);
    }, 350);
  };

  useLayoutEffect(() => {
    function updateWidth() {
      setWinWidth(window.innerWidth);
    }
    window.addEventListener("resize", updateWidth);
    updateWidth();
    return () => window.removeEventListener("resize", updateWidth);
  }, [winWidth]);

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-qatar fixed-top"
      style={{ zIndex: "1100" }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="chromeswap" style={{ height: "2rem" }} />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={handleNavbarToggle}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={
            winWidth > 991
              ? "navbar-collapse collapse"
              : `navbar-collapse ${isCollapsed === false ? "show" : ""} ${
                  isCollapsing === true ? "collapsing" : "collapse"
                }`
          }
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto">
            {!user ? (
              <>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/"
                    onClick={handleNavbarToggle}
                  >
                    Ingresar
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/"
                    onClick={handleNavbarToggle}
                  >
                    Buscar figuritas
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/my-chromes"
                    onClick={handleNavbarToggle}
                  >
                    Mis figuritas
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/my-transactions"
                    onClick={handleNavbarToggle}
                  >
                    Mis intercambios
                  </NavLink>
                </li>
                {user.roles[0] === "ROLE_ADMIN" && (
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      to="admin"
                      onClick={handleNavbarToggle}
                    >
                      Administrar
                    </NavLink>
                  </li>
                )}
                <li className="nav-item">
                  <span
                    role="button"
                    className="nav-link"
                    onClick={() => {
                      handleSignOut();
                      handleNavbarToggle();
                    }}
                  >
                    Cerrar sesión
                  </span>
                </li>
              </>
            )}
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/contact"
                onClick={handleNavbarToggle}
              >
                Contacto
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
