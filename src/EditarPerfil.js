import React, { useState, useEffect } from 'react';
import { Container, Button, Form, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Header from './Header';
import axios from 'axios';
import Swal from 'sweetalert2';

const EditarPerfil = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    confirmPassword: ''
  });

  // Cambia esta URL según tu entorno de desarrollo
  // const API_URL = "http://localhost:5000";
  const API_URL = "https://gateway-41642489028.us-central1.run.app";

  useEffect(() => {
    const usuarioData = localStorage.getItem('usuario');
    console.log('Datos almacenados del usuario:', usuarioData);

    let usuario = null;
    try {
      usuario = JSON.parse(usuarioData);
    } catch (e) {
      console.error('Error al parsear usuario:', e);
    }

    if (!usuario || !usuario._id) {
      console.error('ID de usuario no disponible');
    } else {
      console.log('ID del usuario:', usuario._id);
    }
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      let usuarioData = localStorage.getItem('usuario');
      let usuario = null;

      try {
        usuario = JSON.parse(usuarioData);
      } catch (e) {
        console.error('Error al analizar datos del usuario:', e);
      }

      // Verificar si el usuario tiene un ID válido
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      if (!usuario) {
        throw new Error('No se encontraron datos del usuario');
      }

      // Obtener el ID del usuario
      const userId = usuario._id || usuario.id;

      if (!userId) {
        throw new Error('No se puede identificar el ID del usuario');
      }

      setLoading(true);
      const response = await axios.get(`${API_URL}/usuarios/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const userData = response.data;
      setFormData({
        nombre: userData.nombre || '',
        correo: userData.correo || '',
        password: '',
        confirmPassword: ''
      });
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      setLoading(false);

      // Mostrar mensaje de error específico
      let errorMessage = 'Error al cargar los datos del perfil. Intente nuevamente más tarde.';

      if (error.message === 'No hay token de autenticación' ||
        error.message === 'No se encontraron datos del usuario' ||
        error.message === 'No se puede identificar el ID del usuario') {
        errorMessage = 'No se puede identificar su usuario. Por favor, inicie sesión nuevamente.';
      } else if (error.response?.status === 404) {
        errorMessage = 'No se encontró la información del usuario. Por favor, inicie sesión nuevamente.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.';
      }

      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        // Redirigir a login si hay problemas de autenticación
        if (error.message === 'No hay token de autenticación' ||
          error.message === 'No se encontraron datos del usuario' ||
          error.message === 'No se puede identificar el ID del usuario' ||
          error.response?.status === 401 ||
          error.response?.status === 404) {
          // Limpiar localStorage antes de redirigir
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          navigate('/login');
        }
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      Swal.fire({
        title: 'Atención',
        text: 'El nombre no puede estar vacío',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      return false;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      Swal.fire({
        title: 'Error',
        text: 'Las contraseñas no coinciden',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      let usuarioData = localStorage.getItem('usuario');
      let usuario = null;

      try {
        usuario = JSON.parse(usuarioData);
      } catch (e) {
        console.error('Error al analizar datos del usuario:', e);
        throw new Error('Datos de usuario no válidos');
      }

      // Obtener el ID del usuario
      const userId = usuario._id || usuario.id;

      if (!userId) {
        throw new Error('ID de usuario no disponible');
      }

      // Crear objeto con los datos a enviar (omitir confirmPassword)
      const userData = {
        nombre: formData.nombre
      };

      // Solo incluir password si se ha ingresado una nueva
      if (formData.password) {
        userData.password = formData.password;
      }

      await axios.put(`${API_URL}/usuarios/${userId}`, userData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Actualizar información en localStorage
      const updatedUser = { ...usuario, nombre: formData.nombre };
      localStorage.setItem('usuario', JSON.stringify(updatedUser));

      // Actualizar también el nombre en localStorage si existe
      if (localStorage.getItem('nombre')) {
        localStorage.setItem('nombre', formData.nombre);
      }

      setLoading(false);
      Swal.fire({
        title: '¡Éxito!',
        text: 'Su información ha sido actualizada correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      // Resetear campos de contraseña
      setFormData({
        ...formData,
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setLoading(false);

      let errorMessage = 'No se pudo actualizar la información del perfil';

      if (error.message === 'ID de usuario no disponible' || error.message === 'Datos de usuario no válidos') {
        errorMessage = 'Su sesión no es válida. Por favor, inicie sesión nuevamente';
      } else if (error.response?.status === 401) {
        errorMessage = 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.';
      }

      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        if (error.response?.status === 401 ||
          error.message === 'ID de usuario no disponible' ||
          error.message === 'Datos de usuario no válidos') {
          // Limpiar localStorage antes de redirigir
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          navigate('/login');
        }
      });
    }
  };

  return (
    <div>
      <Header userType={2} />

      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Card className="shadow-lg p-4 w-100" style={{ maxWidth: '500px' }}>
          <Card.Body>
            <h2 className="text-center mb-4">
              <i className="fas fa-user-edit me-2"></i>
              Editar Perfil
            </h2>

            {loading ? (
              <div className="text-center my-4">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </Spinner>
                <p className="mt-2">Cargando información...</p>
              </div>
            ) : (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formNombre">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ingrese su nombre"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    name="correo"
                    value={formData.correo}
                    disabled
                    readOnly
                  />
                  <Form.Text className="text-muted">
                    El correo electrónico no se puede modificar.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Nueva Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Deje en blanco para mantener la actual"
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formConfirmPassword">
                  <Form.Label>Confirmar Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirme su nueva contraseña"
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    type="submit"
                    className="btn-color"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        <span className="ms-2">Guardando...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        Guardar Cambios
                      </>
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => navigate(-1)}
                    disabled={loading}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Volver
                  </Button>
                </div>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default EditarPerfil;