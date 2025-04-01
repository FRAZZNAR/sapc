import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Swal from "sweetalert2";
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

const API_URL = "https://gateway-41642489028.us-central1.run.app";

const Header = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(localStorage.getItem("type"));
  const [userName, setUserName] = useState(() => {
    const userData = localStorage.getItem("usuario");
    return userData ? JSON.parse(userData).nombre : "No usuario";
  });
  const [usuario, setUsuario] = useState(() => {
    const userData = localStorage.getItem("usuario");
    return userData ? JSON.parse(userData) : null;
  });
  
  useEffect(() => {
    const updateUser = () => {
      const userData = localStorage.getItem("usuario");
      setUserType(userData ? JSON.parse(userData).type : null);
      setUserName(userData ? JSON.parse(userData).nombre : "No usuario");
      setUsuario(userData ? JSON.parse(userData) : null);
    };
  
    window.addEventListener("storage", updateUser);
    return () => window.removeEventListener("storage", updateUser);
  }, []);
  
  useEffect(() => {
    if (userType && userType !== "usuario") {
      navigate("/Panel");
    }
  }, [userType, navigate]);

  const handleLogout = async () => {
    try {
      // Verificar que tengamos un usuario y su ID
      if (!usuario || !usuario.id) {
        throw new Error("Información de usuario no disponible");
      }

      // Llamar al endpoint de cerrar sesión
      const response = await axios.post(`${API_URL}/usuarios/cerrar-session`, {
        id: usuario.id
      });

      // Si el cierre de sesión es exitoso
      if (response.data.success) {
        // Limpiar localStorage
        localStorage.clear();
        setUserType(null);
        setUserName(null);
        setUsuario(null);

        // Opcional: Mostrar alerta de cierre de sesión
        Swal.fire({
          icon: 'success',
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión exitosamente',
          timer: 1500,
          showConfirmButton: false
        });

        // Redirigir a la página de inicio
        window.location.href = "/";
      } else {
        // Manejar caso donde el servidor no confirma el cierre de sesión
        throw new Error(response.data.mensaje || "Error al cerrar sesión");
      }
    } catch (error) {
      // Manejar errores de red o del servidor
      console.error("Error al cerrar sesión:", error);
      
      // Opcional: Mostrar alerta de error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'No se pudo cerrar la sesión',
        confirmButtonText: 'Entendido'
      });

      // En caso de error, de todos modos limpiar localStorage y redirigir
      localStorage.clear();
      setUserType(null);
      setUserName(null);
      setUsuario(null);
      window.location.href = "/";
    }
  };

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
                      onClick={(e) => {
                        e.preventDefault(); // Prevenir la navegación por defecto
                        handleLogout(); // Ejecutar la función de cierre de sesión con la API
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