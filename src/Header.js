import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faCircleUser,
  faCircleDown,
  faSearch,
  faEdit,
  faHistory,
  faSignOutAlt,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";
import logo from "./Img/LOGO.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const Header = ({ userType, userName }) => {
  return (
    <nav className="navbar navbar-expand-lg px-3" style={{ backgroundColor: "#214662" }}>
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Logo y título */}
        <div className="d-flex align-items-center">
          <img src={logo} className="me-2" alt="logo" width="50" />
          <h2 className="text-light m-0">Sistema de Análisis de Percepción Ciudadana</h2>
        </div>

        {/* Botones de sesión */}
        <div>
          {userType === null ? (
            <>
              <Link to="/Registro" className="btn me-2" style={{ backgroundColor: "#C4E2E2", color: "#214662" }}>
                <FontAwesomeIcon icon={faUserPlus} /> Registrarse
              </Link>
              <Link to="/Inicio" className="btn" style={{ backgroundColor: "#7896AB", color: "#fff" }}>
                <FontAwesomeIcon icon={faCircleUser} /> Iniciar Sesión
              </Link>
            </>
          ) : userType === 2 ? (
            <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faCircleUser} className="me-2 text-white" size="lg" />
              <div className="text-white">
                <p className="mb-0">correo@ejemplo.com</p>
              </div>
              <div className="ms-3">
                <div className="dropdown">
                  <button
                    className="btn dropdown-toggle"
                    style={{ backgroundColor: "#7896AB", color: "#fff" }}
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <FontAwesomeIcon icon={faCircleDown} /> {userName}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li>
                      <Link className="dropdown-item" to="/">
                        <FontAwesomeIcon icon={faHouse} className="me-2" /> Inicio
                      </Link>
                    </li>
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
                      <Link className="dropdown-item" to="/HistorialInisec">
                        <FontAwesomeIcon icon={faHistory} className="me-2" /> Historial de Inicios de sesión
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <Link className="dropdown-item text-danger" to="/">
                        <FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Cerrar sesión
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Header;
