import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Registro.css";
import regImg from "./Img/Inicio1.jpg";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4008";

const Registro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
    confirmarContraseña: "",
    telefono: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Limpiar mensaje de error cuando el usuario comienza a escribir
    if (error) setError("");
  };

  const validarFormulario = () => {
    const { nombre, correo, contraseña, confirmarContraseña, telefono } = formData;

    if (!nombre || !correo || !contraseña || !confirmarContraseña || !telefono) {
      setError("Todos los campos son obligatorios.");
      return false;
    }
    
    if (contraseña !== confirmarContraseña) {
      setError("Las contraseñas no coinciden.");
      return false;
    }

    if (contraseña.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return false;
    }

    // Validación básica de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      setError("Ingresa un correo electrónico válido.");
      return false;
    }

    // Validación de teléfono (formato mexicano 10 dígitos)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(telefono)) {
      setError("Ingresa un número de teléfono válido (10 dígitos).");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const { nombre, correo, contraseña, telefono } = formData;
      
      // Enviar solicitud de registro
      const response = await axios.post(`${API_URL}/usuarios/registro`, {
        nombre,
        correo,
        contraseña,
        telefono
      });
      
      // Guardar token en localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      
      setError("");
      alert("Registro exitoso");
      navigate("/Inicio");
    } catch (error) {
      console.error("Error de registro:", error);
      if (error.response && error.response.status === 400) {
        setError(error.response.data.mensaje);
      } else {
        setError(
          "Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registro-container container-fluid">
      <div className="row align-items-center justify-content-center">
        <div className="col-md-6 d-flex justify-content-center">
          <img src={regImg} alt="Registro" className="img-fluid registro-img" />
        </div>
        
        <div className="col-md-6 p-4">
          <div className="registro-form p-4 shadow rounded">
            <i
              className="fa-regular fa-circle-left"
              onClick={() => navigate("/")}
              style={{ cursor: "pointer", fontSize: "24px", color: "#000000" }}
            ></i>
            <h2 className="text-center"><i className="fa-solid fa-user-plus"></i> Registro</h2>
            <p className="text-center">Completa el formulario para registrarte.</p>
            {error && <p className="error text-danger text-center">{error}</p>}
            
            <form onSubmit={handleSubmit}>
              {[
                { label: "Nombre", name: "nombre", type: "text", placeholder: "Ej. Juan Pérez" },
                { label: "Correo Electrónico", name: "correo", type: "email", placeholder: "Ej. usuario@email.com" },
                { label: "Teléfono", name: "telefono", type: "tel", placeholder: "Ej. 5512345678" },
                { label: "Contraseña", name: "contraseña", type: "password", placeholder: "Mínimo 8 caracteres" },
                { label: "Confirmar Contraseña", name: "confirmarContraseña", type: "password", placeholder: "Repite tu contraseña" },
              ].map(({ label, name, type, placeholder }) => (
                <div className="form-group mb-3" key={name}>
                  <label className="form-label">{label}:</label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="form-control"
                    required
                  />
                </div>
              ))}
              <button 
                type="submit" 
                className="btn-color w-100" 
                disabled={loading}
              >
                {loading ? (
                  <span>
                    <i className="fas fa-spinner fa-spin me-2"></i>Procesando...
                  </span>
                ) : "Registrarse"}
              </button>
            </form>
            <hr className="my-4" />
            <p className="text-center">¿Ya tienes cuenta? <a href="/Inicio">Inicia sesión</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;