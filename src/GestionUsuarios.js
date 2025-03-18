import React, { useState, useEffect } from 'react';
import { Container, Button, Table, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import NavBar from './NavBar';
import axios from 'axios';
import HeaderComponent from './HeaderComponent.js';
import Swal from 'sweetalert2'; // Importamos SweetAlert2

const GestionUsuarios = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    type: 'user'
  });

  const API_URL = "https://gateway-41642489028.us-central1.run.app";
  // const API_URL = 'http://localhost:3000';

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem('token'); 
      const response = await axios.get(`${API_URL}/usuarios`, {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });

      console.log("Respuesta de la API:", response.data);
      
      // Manejo de ambos formatos de respuesta
      if (Array.isArray(response.data)) {
        setUsuarios(response.data);
      } else if (response.data && response.data.usuarios) {
        setUsuarios(response.data.usuarios);
      } else {
        console.error('Formato de respuesta no esperado:', response.data);
        setUsuarios([]);
      }
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
      if (error.response && error.response.status === 401) {
        Swal.fire({
          title: 'Sesión expirada',
          text: 'No se proporcionó token de autenticación. Por favor, inicie sesión nuevamente.',
          icon: 'warning',
          confirmButtonText: 'Ir a login'
        }).then(() => {
          navigate('/login');
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los usuarios. Intente nuevamente más tarde.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    }
  };
  
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleLogout = () => {
    localStorage.setItem('usuario', null);
    Swal.fire({
      title: 'Sesión cerrada',
      text: 'Ha cerrado sesión exitosamente',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    }).then(() => {
      navigate('/');
    });
  };

  // Modal handlers
  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      nombre: user.nombre,
      correo: user.correo,
      type: user.type || 'user'
    });
    setShowEditModal(true);
  };

  const openToggleModal = (user) => {
    setSelectedUser(user);
    setShowToggleModal(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // API actions
  const handleEditUser = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/usuarios/${selectedUser._id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setShowEditModal(false);
      fetchUsuarios(); 
      Swal.fire({
        title: 'Usuario actualizado',
        text: 'La información del usuario se actualizó correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo actualizar la información del usuario',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  const handleToggleUserStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const newStatus = !selectedUser.active;
      await axios.patch(`${API_URL}/usuarios/${selectedUser._id}/status`, {
        active: newStatus
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setShowToggleModal(false);
      fetchUsuarios(); 
      Swal.fire({
        title: 'Estado actualizado',
        text: `El usuario ha sido ${newStatus ? 'activado' : 'desactivado'} exitosamente`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error al cambiar estado del usuario:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo cambiar el estado del usuario',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/usuarios/${selectedUser._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setShowDeleteModal(false);
      fetchUsuarios();
      Swal.fire({
        title: 'Usuario eliminado',
        text: 'El usuario ha sido eliminado permanentemente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar el usuario',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  // Confirmación de eliminación con SweetAlert
  const confirmDeleteWithSweetAlert = (user) => {
    Swal.fire({
      title: '¿Eliminar usuario?',
      html: `¿Está seguro que desea eliminar permanentemente al usuario <strong>${user.nombre}</strong>?<br>
             <span class="text-danger fw-bold">Esta acción no se puede deshacer.</span>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedUser(user);
        handleDeleteUser();
      }
    });
  };

  return (
    <div className="bootstrap-container">
      <NavBar userType={1} />
      <div className="main-content">
        <header className="header">
          <HeaderComponent />
        </header>
        <h2 className="text-center">Gestión de Usuarios</h2>
        
        <Container className="mt-4">
          <Table bordered hover className="table-striped mt-3">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length > 0 ? (
                usuarios.map((usuario) => (
                  <tr key={usuario._id}>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.correo}</td>
                    <td>{usuario.type === 'admin' ? 'Administrador' : 'Usuario'}</td>
                    <td>
                      <span className={`badge ${usuario.active ? 'bg-success' : 'bg-danger'}`}>
                        {usuario.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <Button 
                        variant="primary" 
                        className="me-2"
                        onClick={() => openEditModal(usuario)}
                      >
                        <i className="fa-solid fa-pen"></i>
                      </Button>
                      <Button 
                        variant="warning" 
                        className="me-2"
                        onClick={() => openToggleModal(usuario)}
                      >
                        <i className={`fa-solid ${usuario.active ? 'fa-toggle-on' : 'fa-toggle-off'}`}></i>
                      </Button>
                      <Button 
                        variant="danger"
                        onClick={() => confirmDeleteWithSweetAlert(usuario)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No hay usuarios registrados.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Container>
      </div>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control 
                type="text" 
                name="nombre"
                value={formData.nombre} 
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control 
                type="email" 
                name="correo"
                value={formData.correo} 
                onChange={handleInputChange}
                disabled
              />
              <Form.Text className="text-muted">
                El correo electrónico no se puede modificar.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Usuario</Form.Label>
              <Form.Select 
                name="type"
                value={formData.type} 
                onChange={handleInputChange}
              >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleEditUser}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para activar/desactivar usuarios */}
      <Modal show={showToggleModal} onHide={() => setShowToggleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cambiar Estado de Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <p>
              ¿Está seguro que desea {selectedUser.active ? "desactivar" : "activar"} al usuario <strong>{selectedUser.nombre}</strong>?
              <br />
              {selectedUser.active 
                ? "El usuario no podrá acceder a la plataforma." 
                : "El usuario podrá volver a acceder a la plataforma."}
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowToggleModal(false)}>
            Cancelar
          </Button>
          <Button 
            variant={selectedUser?.active ? "danger" : "success"} 
            onClick={handleToggleUserStatus}
          >
            {selectedUser?.active ? "Desactivar" : "Activar"} Usuario
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para eliminar usuarios (se mantiene pero ya no se usa directamente) */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <p>
              ¿Está seguro que desea eliminar permanentemente al usuario <strong>{selectedUser.nombre}</strong>?
              <br />
              <span className="text-danger fw-bold">Esta acción no se puede deshacer.</span>
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Eliminar Permanentemente
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GestionUsuarios;