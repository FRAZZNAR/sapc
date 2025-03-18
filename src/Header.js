import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faCircleUser,
  faCircleDown,
  faSearch,
  faEdit,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import logo from "./Img/LOGO.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import HeaderComponent from "./HeaderComponent.js";

const Header = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(localStorage.getItem("type"));
  const [userName, setUserName] = useState(() => {
    const userData = localStorage.getItem("usuario");
    return userData ? JSON.parse(userData).nombre : "No usuario";
  });
  
  useEffect(() => {
    const updateUser = () => {
      const userData = localStorage.getItem("usuario");
      setUserType(userData ? JSON.parse(userData).type : null);
      setUserName(userData ? JSON.parse(userData).nombre : "No usuario");
    };
  
    window.addEventListener("storage", updateUser);
    return () => window.removeEventListener("storage", updateUser);
  }, []);
  

  useEffect(() => {
    if (userType && userType !== "usuario") {
      navigate("/Panel");
    }
  }, [userType, navigate]);
  return (
    <nav className="navbar navbar-expand-lg px-3" style={{ backgroundColor: "#214662" }}>
      <div className="container-fluid">
        {/* Logo y título */}
        <div className="d-flex align-items-center">
          <img src={logo} className="me-2" alt="logo" width="50" />
          <h2 className="text-light m-0">Sistema de Análisis de Percepción Ciudadana</h2>
        </div>
  
        {/* Sección derecha del navbar */}
        <div className="d-flex align-items-center">
          {!userType ? (
            <>
              <Link to="/Registro" className="btn me-2" style={{ backgroundColor: "#C4E2E2", color: "#214662" }}>
                <FontAwesomeIcon icon={faUserPlus} /> Registrarse
              </Link>
              <Link to="/Inicio" className="btn" style={{ backgroundColor: "#7896AB", color: "#fff" }}>
                <FontAwesomeIcon icon={faCircleUser} /> Iniciar Sesión
              </Link>
            </>
          ) : (
            <>
              {/* Mostrar nombre alineado a la derecha */}
              <span className="text-white me-3">{userName ? userName : "No usuario"}</span>
              <FontAwesomeIcon icon={faCircleUser} className="me-3 text-white" size="lg" />
  
              {/* Menú desplegable */}
              <div className="dropdown">
                <button
                  className="btn dropdown-toggle"
                  style={{ backgroundColor: "#7896AB", color: "#fff" }}
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FontAwesomeIcon icon={faCircleDown} />
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item" to="/HistorialBusqueda">
                      <FontAwesomeIcon icon={faSearch} className="me-2" /> Historial de búsquedas
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/EditarPerfil">
                      <FontAwesomeIcon icon={faEdit} className="me-2" /> Editar Perfil
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link
                      className="dropdown-item text-danger"
                      to="/"
                      onClick={() => {
                        localStorage.clear();
                        setUserType(null);
                        setUserName(null);
                        window.location.href = "/";
                      }}
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Cerrar sesión
                    </Link>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
  
};

export default Header;
