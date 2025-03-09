import React from 'react';
import { Container, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Panel.css';
import NavBar from './NavBar'; 
import HeaderComponent from './HeaderComponent.js';


const Panel = () => {
  return (
    <div className="bootstrap-container"> 
      <NavBar userType={1} /> 
      <div className="main-content">
        <header className="header">
        <HeaderComponent />

        </header>
        <Container className="mt-4">
        </Container>
      </div>
    </div>
  );
};

export default Panel;
