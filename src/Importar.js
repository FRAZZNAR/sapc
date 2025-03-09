import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import NavBar from './NavBar';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom'; 
import HeaderComponent from './HeaderComponent.js';


const Importar = () => {
  const [user, setUser] = useState('correo@ejemplo.com');
  const navigate = useNavigate();

  const { getRootProps, getInputProps } = useDropzone({
    accept: '.csv, .json, .xml',
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles);
    }
  });

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <div className="bootstrap-container">
      <NavBar userType={1} />
      <div className="main-content">
        <header className="header">
        <HeaderComponent />
        </header>

        <Container className="mt-4">
          <h1 className="text-center mb-4">Importar archivos</h1>
        </Container>

        <Container className="mt-4 d-flex justify-content-center">
          <div
            {...getRootProps()}
            style={{
              border: '2px dashed #214662',
              padding: '60px',
              textAlign: 'center',
              borderRadius: '10px',
              marginTop: '30px',
              cursor: 'pointer',
              minHeight: '550px',
              width: '80%',
              backgroundColor: '#f9f9f9',
              boxShadow: '0px 4px 20px rgba(0, 123, 255, 0.3)',
              transition: 'all 0.3s ease-in-out',
            }}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
          >
            <input {...getInputProps()} />
            <p style={{ fontSize: '18px', color: '#555' }}>Arrastra y suelta un archivo (.csv, .json, .xml) aquí, o haz clic para seleccionarlo</p>
            <div style={{ fontSize: '30px', color: '#007bff', fontWeight: 'bold' }}>
              ¡Hazlo fácil, carga un archivo!
              <i className="fa-solid fa-upload" style={{ fontSize: '40px' }}></i>
            </div>


          </div>
        </Container>
      </div>
    </div>
  );
};

export default Importar;
