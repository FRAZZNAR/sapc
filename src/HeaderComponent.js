import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";

const HeaderComponent = () => {
  const [correo, setCorreo] = useState("");

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");

    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      setCorreo(usuario.correo);
    }
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("usuario"); // Elimina datos del usuario
    localStorage.removeItem("token");   // Elimina el token
    window.location.href = "/";         // Redirige a la página de inicio
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center">
        <div className="ms-3">
          <p className="mb-0">{correo ? correo : "Correo no disponible"}</p>
        </div>
        <Button variant="danger" onClick={handleLogout}>
          <i className="fa-solid fa-arrow-right-from-bracket"></i> Cerrar Sesión
        </Button>
      </div>
    </Container>
  );
};

export default HeaderComponent;
