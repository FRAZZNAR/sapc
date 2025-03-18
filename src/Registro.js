import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Registro.css";
import regImg from "./Img/Inicio1.jpg";
import { GoogleLogin } from "@react-oauth/google";
import Swal from "sweetalert2"; // Importamos SweetAlert2

const API_URL = "https://gateway-41642489028.us-central1.run.app";

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
    if (error) setError("");
  };

  // Función para mostrar alertas de error
  const showErrorAlert = (mensaje) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje,
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#3085d6',
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        confirmButton: 'swal-custom-button'
      }
    });
  };

  // Función para mostrar alertas de éxito
  const showSuccessAlert = (mensaje, callback) => {
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: mensaje,
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false,
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title'
      }
    }).then(() => {
      if (callback) callback();
    });
  };

  const validarFormulario = () => {
    const { nombre, correo, contraseña, confirmarContraseña, telefono } = formData;

    if (!nombre || !correo || !contraseña || !confirmarContraseña || !telefono) {
      setError("Todos los campos son obligatorios.");
      showErrorAlert("Todos los campos son obligatorios.");
      return false;
    }

    if (contraseña !== confirmarContraseña) {
      setError("Las contraseñas no coinciden.");
      showErrorAlert("Las contraseñas no coinciden.");
      return false;
    }

    if (contraseña.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      showErrorAlert("La contraseña debe tener al menos 8 caracteres.");
      return false;
    }

    const specialCharRegex = /[!@#$%^&*()_+[\]{}|;:'",.<>?/]/;
    if (!specialCharRegex.test(contraseña)) {
      setError("La contraseña debe contener al menos un signo especial (!@#$%^&*...).");
      showErrorAlert("La contraseña debe contener al menos un signo especial (!@#$%^&*...).");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      setError("Ingresa un correo electrónico válido.");
      showErrorAlert("Ingresa un correo electrónico válido.");
      return false;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(telefono)) {
      setError("Ingresa un número de teléfono válido (10 dígitos).");
      showErrorAlert("Ingresa un número de teléfono válido (10 dígitos).");
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

      const response = await axios.post(`${API_URL}/usuarios/registro`, {
        nombre,
        correo,
        contraseña,
        telefono
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      localStorage.setItem('type', response.data.usuario.type);
      localStorage.setItem('nombre', response.data.usuario.nombre);

      setError("");
      showSuccessAlert("¡Registro exitoso! Redirigiendo al inicio de sesión...", () => {
        navigate("/Inicio");
      });
    } catch (error) {
      console.error("Error de registro:", error);
      if (error.response && error.response.status === 400) {
        setError(error.response.data.mensaje);
        showErrorAlert(error.response.data.mensaje);
      } else {
        const errorMsg = "Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.";
        setError(errorMsg);
        showErrorAlert(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (response) => {
    if (!response?.credential) {
      const errorMsg = "No se pudo obtener credenciales de Google.";
      setError(errorMsg);
      showErrorAlert(errorMsg);
      return;
    }

    setLoading(true);
    try {
      const googleToken = response.credential;

      const res = await axios.post(`${API_URL}/usuarios/google-login`, {
        token: googleToken,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("usuario", JSON.stringify(res.data.usuario));
        localStorage.setItem("type", res.data.usuario.type);
        localStorage.setItem("nombre", res.data.usuario.nombre || "Usuario");

        showSuccessAlert("Inicio exitoso con Google", () => {
          navigate("/");
        });
      } else {
        const errorMsg = "Hubo un problema con el inicio de sesión con Google.";
        setError(errorMsg);
        showErrorAlert(errorMsg);
      }
    } catch (error) {
      console.error("Error de login con Google:", error);
      const errorMsg = error.response?.data?.mensaje || "Error al iniciar sesión con Google. Intenta nuevamente.";
      setError(errorMsg);
      showErrorAlert(errorMsg);
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
                    disabled={loading}
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
              <div className="d-flex justify-content-center my-3">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => {
                    const errorMsg = "Error en el login de Google";
                    setError(errorMsg);
                    showErrorAlert(errorMsg);
                  }}
                  text="signin_with"
                  shape="rectangular"
                  theme="outline"
                  locale="es"
                  disabled={loading}
                />
              </div>
            </form>
            <hr className="my-4" />
            <p className="text-center">¿Ya tienes cuenta? <Link to="/Inicio">Inicia sesión</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;