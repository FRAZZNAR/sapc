import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import "./Inise.css";
import regImg from "./Img/Reg1.jpg";

const API_URL = "https://gateway-41642489028.us-central1.run.app";
// const API_URL = "http://localhost:3000";

const Inicio = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    correo: "",
    contraseña: "",
    codigoVerificacion: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [esperandoCodigo, setEsperandoCodigo] = useState(false);
  const [tempToken, setTempToken] = useState("");
  const [tempUsuario, setTempUsuario] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  
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

  // Función para iniciar el temporizador de reenvío
  const iniciarTemporizador = () => {
    clearInterval(timerInterval);
    setTiempoRestante(120); // 2 minutos
    
    const intervalo = setInterval(() => {
      setTiempoRestante(prevTime => {
        if (prevTime <= 1) {
          clearInterval(intervalo);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    setTimerInterval(intervalo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { correo, contraseña, codigoVerificacion } = formData;

    // Si estamos esperando un código de verificación
    if (esperandoCodigo) {
      if (!codigoVerificacion) {
        setError("El código de verificación es obligatorio.");
        showErrorAlert("El código de verificación es obligatorio.");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.post(`${API_URL}/usuarios/verificar-codigo`, {
          correo,
          codigo: codigoVerificacion,
          tempToken
        });

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("usuario", JSON.stringify(tempUsuario));
          localStorage.setItem("type", tempUsuario.type);
          localStorage.setItem("nombre", tempUsuario.nombre || "Usuario");

          showSuccessAlert("Verificación exitosa", () => {
            navigate("/");
          });
        } else {
          setError("Error en la verificación del código.");
          showErrorAlert("Error en la verificación del código.");
        }
      } catch (error) {
        const errorMsg =
          error.response?.data?.mensaje ||
          "Código de verificación inválido. Intenta nuevamente.";
        setError(errorMsg);
        showErrorAlert(errorMsg);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Verificación de credenciales inicial
    if (!correo || !contraseña) {
      setError("Todos los campos son obligatorios.");
      showErrorAlert("Todos los campos son obligatorios.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/usuarios/login-codigo`, {
        correo,
        contraseña,
      });

      if (response.data.tempToken) {
        setTempToken(response.data.tempToken);
        setTempUsuario(response.data.usuario);
        setEsperandoCodigo(true);
        iniciarTemporizador();
        showSuccessAlert("Código de verificación enviado a tu correo");
      } else {
        setError("No se pudo enviar el código de verificación.");
        showErrorAlert("No se pudo enviar el código de verificación.");
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

  const reenviarCodigo = async () => {
    if (tiempoRestante > 0) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/usuarios/reenviar-codigo`, {
        correo: formData.correo,
        tempToken
      });

      if (response.data.success) {
        iniciarTemporizador();
        showSuccessAlert("Nuevo código enviado a tu correo");
      } else {
        setError("No se pudo reenviar el código de verificación.");
        showErrorAlert("No se pudo reenviar el código de verificación.");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.mensaje ||
        "Error al reenviar el código. Intenta nuevamente.";
      setError(errorMsg);
      showErrorAlert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const cancelarVerificacion = () => {
    setEsperandoCodigo(false);
    setTempToken("");
    setTempUsuario(null);
    setFormData({
      ...formData,
      codigoVerificacion: ""
    });
    clearInterval(timerInterval);
    setTiempoRestante(0);
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

      const res = await axios.post(`${API_URL}/usuarios/google-login-codigo`, {
        token: googleToken,
      });

      if (res.data.tempToken) {
        setTempToken(res.data.tempToken);
        setTempUsuario(res.data.usuario);
        setFormData({
          ...formData,
          correo: res.data.usuario.correo || "",
        });
        setEsperandoCodigo(true);
        iniciarTemporizador();
        showSuccessAlert("Código de verificación enviado a tu correo");
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

  const formatoTiempo = (segundos) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos}:${segs < 10 ? '0' + segs : segs}`;
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
            <h2 className="text-center mb-4">
              {esperandoCodigo ? "Verificación" : "Iniciar sesión"}
            </h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              {!esperandoCodigo ? (
                <>
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
                </>
              ) : (
                <>
                  <div className="mb-3">
                    <p className="text-center mb-2">
                      Hemos enviado un código de verificación a:
                    </p>
                    <p className="text-center fw-bold mb-4">{formData.correo}</p>
                  </div>
                  <div className="form-group mb-4">
                    <label htmlFor="codigoVerificacion">Código de verificación:</label>
                    <input
                      type="text"
                      name="codigoVerificacion"
                      id="codigoVerificacion"
                      value={formData.codigoVerificacion}
                      onChange={handleChange}
                      className="form-control text-center"
                      placeholder="Ingresa el código de 6 dígitos"
                      maxLength="6"
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
                    {loading ? "Verificando..." : "Verificar"}
                  </button>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <button
                      type="button"
                      className="btn btn-link text-decoration-none"
                      onClick={cancelarVerificacion}
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className={`btn btn-link text-decoration-none ${tiempoRestante > 0 ? 'disabled' : ''}`}
                      onClick={reenviarCodigo}
                      disabled={loading || tiempoRestante > 0}
                    >
                      {tiempoRestante > 0 
                        ? `Reenviar (${formatoTiempo(tiempoRestante)})` 
                        : "Reenviar código"}
                    </button>
                  </div>
                </>
              )}
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