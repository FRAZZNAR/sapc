import React from 'react';
import { Container, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Panel.css';
import NavBar from './NavBar';
import HeaderComponent from './HeaderComponent';
import { Navigate } from 'react-router-dom';

const Panel = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/Inicio" />;
  }

  return (
    <div className="bootstrap-container">
      <NavBar />
      <div className="main-content">
        <header className="header">
          <HeaderComponent />
        </header>
        <Container className="mt-4">
          <p>Bienvenido al panel de administración, donde puedes gestionar todo.</p>
        </Container>
      </div>
    </div>
  );
};

export default Panel;
