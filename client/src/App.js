import ReactGA from "react-ga";
import Router from "./Router";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import 'animate.css';
import "./App.css";
import { useEffect, useState } from "react";
import { API, TRACKING_ID } from "./Global";
import UserContext from "./Context/UserContext";
import Swal from "sweetalert2";

ReactGA.initialize(TRACKING_ID);

function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    const requestOptions = {
      method: "POST",
      credentials: "include",
    };

    fetch(`${API}/auth/check-signed`, requestOptions)
      .then(async (res) => {
        const data = await res.json();
        if (data.message === "jwt expired") {
          setUser(null);
          Swal.fire({
            title: "Su sesión ha expirado",
            icon: "warning",
          });
        }
        if (data.id) {
          setUser(data);
        } else {
          setUser(null);
        }
      })
      .catch((err) => {
        setUser(null);
        console.error(err);
      });

    return () => {};
  }, []);

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div className="App d-flex flex-column min-vh-100">
        <Router />
      </div>
    </UserContext.Provider>
  );
}

export default App;
