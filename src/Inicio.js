import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import Swal from "sweetalert2"; // Importamos SweetAlert2
import "./Inise.css";
import regImg from "./Img/Reg1.jpg";

const API_URL = "https://gateway-41642489028.us-central1.run.app";

const Inicio = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    correo: "",
    contraseña: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  // Función para mostrar alerta de éxito
  const showSuccessAlert = (mensaje, callback) => {
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: mensaje,
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        content: 'swal-custom-content'
      }
    }).then(() => {
      if (callback) callback();
    });
  };

  // Función para mostrar alerta de error
  const showErrorAlert = (mensaje) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje,
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#C4E2E2',
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        confirmButton: 'swal-custom-button'
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { correo, contraseña } = formData;

    if (!correo || !contraseña) {
      setError("Todos los campos son obligatorios.");
      showErrorAlert("Todos los campos son obligatorios.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/usuarios/login`, {
        correo,
        contraseña,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("usuario", JSON.stringify(response.data.usuario));
        localStorage.setItem("type", response.data.usuario.type);
        localStorage.setItem("nombre", response.data.usuario.nombre || "Usuario");

        showSuccessAlert("Inicio de sesión exitoso", () => {
          navigate("/");
        });
      } else {
        setError("Hubo un problema con el inicio de sesión.");
        showErrorAlert("Hubo un problema con el inicio de sesión.");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.mensaje ||
        "Error al iniciar sesión. Verifica tus credenciales.";
      setError(errorMsg);
      showErrorAlert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (response) => {
    if (!response?.credential) {
      setError("No se pudo obtener credenciales de Google.");
      showErrorAlert("No se pudo obtener credenciales de Google.");
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

        showSuccessAlert("Inicio de sesión con Google exitoso", () => {
          navigate("/");
        });
      } else {
        setError("Hubo un problema con el inicio de sesión con Google.");
        showErrorAlert("Hubo un problema con el inicio de sesión con Google.");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.mensaje ||
        "Error al iniciar sesión con Google. Intenta nuevamente.";
      setError(errorMsg);
      showErrorAlert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="container-fluid vh-100 d-flex justify-content-center align-items-center"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <div className="row w-100 h-100">
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <motion.img
            src={regImg}
            alt="Inicio"
            className="img-fluid rounded"
            style={{ maxHeight: "600px", objectFit: "contain", borderRadius: "50px" }}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, yoyo: Infinity }}
          />
        </div>
        <div className="col-md-4 d-flex justify-content-center align-items-center">
          <motion.div
            className="card shadow-lg p-4 w-75"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/">
              <i
                className="fa-regular fa-circle-left"
                style={{ cursor: "pointer", fontSize: "24px", color: "#000000" }}
              ></i>
            </Link>
            <h2 className="text-center mb-4">Iniciar sesión</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label htmlFor="correo">Correo Electrónico:</label>
                <input
                  type="email"
                  name="correo"
                  id="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Ej. usuario@email.com"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group mb-4">
                <label htmlFor="contraseña">Contraseña:</label>
                <input
                  type="password"
                  name="contraseña"
                  id="contraseña"
                  value={formData.contraseña}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Mínimo 8 caracteres"
                  required
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                className="btn btn-block w-100 mb-3"
                style={{ backgroundColor: "#C4E2E2", color: "black" }}
                disabled={loading}
              >
                {loading ? "Cargando..." : "Iniciar sesión"}
              </button>

              <div className="d-flex justify-content-center my-2">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => {
                    setError("Error en el login de Google");
                    showErrorAlert("Error en el login de Google");
                  }}
                  text="signin_with"
                  shape="rectangular"
                  theme="outline"
                  locale="es"
                  disabled={loading}
                />
              </div>
            </form>

            <div className="text-center">
              <hr />
              <p>
                ¿No tienes cuenta? <Link to="/Registro">Regístrate</Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Inicio;