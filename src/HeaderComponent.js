import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import axios from "axios"; // Asegúrate de importar axios
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import Swal from "sweetalert2"; // Opcional, para mostrar alertas

const API_URL = "https://gateway-41642489028.us-central1.run.app";

const HeaderComponent = () => {
  const [correo, setCorreo] = useState("");
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate(); // Hook de navegación

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    
    if (usuarioGuardado) {
      const usuarioParsed = JSON.parse(usuarioGuardado);
      setCorreo(usuarioParsed.correo);
      setUsuario(usuarioParsed);
    }
  }, []);

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
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
        localStorage.removeItem("type");
        localStorage.removeItem("nombre");

        // Opcional: Mostrar alerta de cierre de sesión
        Swal.fire({
          icon: 'success',
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión exitosamente',
          timer: 1500,
          showConfirmButton: false
        });

        // Redirigir a la página de inicio/login
        navigate("/");
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
      localStorage.removeItem("usuario");
      localStorage.removeItem("token");
      localStorage.removeItem("type");
      localStorage.removeItem("nombre");
      navigate("/");
    }
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center">
        <div className="ms-3">
          <p className="mb-0">
            {correo ? `Bienvenido: ${correo}` : "Correo no disponible"}
          </p>
        </div>
        <Button variant="danger" onClick={handleLogout}>
          <i className="fa-solid fa-arrow-right-from-bracket me-2"></i> 
          Cerrar Sesión
        </Button>
      </div>
    </Container>
  );
};

export default HeaderComponent;