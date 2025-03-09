import React from 'react';
import { Container, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Panel.css';
import NavBar from './NavBar'; 

const Panel = () => {
  return (
    <div className="bootstrap-container"> 
      <NavBar userType={1} /> 
      <div className="main-content">
        <header className="header">
          <Container>
            <div className="d-flex justify-content-between align-items-center">
              <div className="ms-3">
                <p className="mb-0">correo@ejemplo.com</p>
              </div><br></br>
              <Button variant="danger"><i class="fa-solid fa-arrow-right-from-bracket"></i> Cerrar Sesión </Button>
            </div>
          </Container>
        </header>
        <Container className="mt-4">
        </Container>
      </div>
    </div>
  );
};

export default Panel;
