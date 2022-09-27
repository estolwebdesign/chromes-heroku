import logo from "./logo.svg";
import Router from "./Router";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "./App.css";
import { useContext, useEffect, useState } from "react";
import { API, PRODUCTION_API } from "./Global";
import UserContext from "./Context/UserContext";
import Swal from "sweetalert2";

function App() {
  const [user, setUser] = useState();

  useEffect(() => {

    const requestOptions = {
      method: "POST",
      credentials: "include",
    };
    
    fetch(`${API}/auth/check-signed`, JSON.stringify(requestOptions))
      .then(async (res) => {
        const data = await res.json();
        if (data.id) {
          setUser(data);
        }
        if (data.message === "jwt expired") {
          setUser(null);
          Swal.fire({
            title: "Su sesión ha expirado",
            icon: "warning",
          });
        }
      })
      .catch((err) => {
        setUser(null);
        console.error(err);
      });

    return () => {};
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div className="App">
        <Router />
      </div>
    </UserContext.Provider>
  );
}

export default App;
