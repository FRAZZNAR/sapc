import React, { useState, useEffect } from 'react';
import { Container, Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import NavBar from './NavBar';
import axios from 'axios';

const GestionUsuarios = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  
  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost:3000/usuarios');
      console.log('Respuesta del servidor:', response.data);
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
    }
  };
  
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleLogout = () => {
    localStorage.setItem('usuario', null);
    navigate('/');
  };

  return (
    <div className="bootstrap-container">
      <NavBar userType={1} />
      <div className="main-content">
        <header className="header">
          <Container>
            <div className="d-flex justify-content-between align-items-center">
              <div className="ms-3">
                <p className="mb-0">correo@ejemplo.com</p>
              </div>
              <Button variant="danger" onClick={handleLogout}>
                <i className="fa-solid fa-arrow-right-from-bracket"></i> Cerrar Sesión
              </Button>
            </div>
          </Container>
        </header>
        <h2 className="text-center">Gestión de Usuarios</h2>
        
        <Container className="mt-4">
          <Table bordered hover className="table-striped mt-3">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Tipo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length > 0 ? (
                usuarios.map((usuario, index) => (
                  <tr key={index}>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.correo}</td>
                    <td>{usuario.type === 'admin' ? 'Administrador' : 'Usuario'}</td>
                    <td>
                      <Button variant="primary" className="me-2"><i className="fa-solid fa-pen"></i></Button>
                      <Button variant="warning" className="me-2"><i className="fa-solid fa-toggle-on"></i></Button>
                      <Button variant="danger"><i className="fa-solid fa-trash"></i></Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">No hay usuarios registrados.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Container>
      </div>
    </div>
  );
};

export default GestionUsuarios;