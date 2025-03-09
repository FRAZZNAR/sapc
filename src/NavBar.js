import React from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUser } from '@fortawesome/free-solid-svg-icons';
import './App.css';

const NavBar = ({ userType }) => {
  return (
    <nav className="col-md-3 col-lg-2 d-md-block sidebar">
      <div className="position-sticky">
        <ul className="nav flex-column">
          {userType === 1 && (
            <>
              <li className="nav-item">
                <Link className="nav-link active" to="/Panel">
                  <i className="fas fa-tachometer-alt me-2"></i> Inicio
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/GestionUsuarios">
                  <i className="fas fa-users-cog me-2"></i> Gestión de Usuarios
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/Popularidad">
                  <i className="fa-solid fa-fire"></i> Popularidad
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/Importar">
                  <i className="fa-solid fa-file-import"></i> Importar
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/HistorialIniSec">
                  <i className="fas fa-clock me-2"></i> Historial de inicios de sesión
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
