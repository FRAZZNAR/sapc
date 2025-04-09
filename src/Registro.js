import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Registro.css";
import regImg from "./Img/Inicio1.jpg";
import { GoogleLogin } from "@react-oauth/google";
import Swal from "sweetalert2";

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
  
  // Estados para manejo de verificación por código
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
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

  // Paso 1: Inicio de sesión con Google que solicita código de verificación
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

      // Usar el nuevo endpoint para solicitar código de verificación
      const res = await axios.post(`${API_URL}/usuarios/google-login-codigo`, {
        token: googleToken,
      });

      // Almacenar el token temporal y mostrar formulario de verificación
      if (res.data.tempToken) {
        setTempToken(res.data.tempToken);
        setUserInfo(res.data.usuario);
        setSessionId(res.data.sessionId || "");
        setShowVerification(true);
        
        Swal.fire({
          icon: 'info',
          title: 'Verificación requerida',
          text: 'Hemos enviado un código de verificación a tu correo electrónico. Por favor, revisa tu bandeja de entrada.',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#3085d6',
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

  // Paso 2: Verificar el código recibido por correo
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    
    if (!verificationCode) {
      setError("Debes ingresar el código de verificación");
      showErrorAlert("Debes ingresar el código de verificación");
      return;
    }
    
    if (!tempToken) {
      Swal.fire({
        icon: 'warning',
        title: 'Sesión expirada',
        text: 'Tu sesión ha expirado. Por favor, solicita un nuevo código o inicia sesión nuevamente.',
        showCancelButton: true,
        confirmButtonText: 'Solicitar nuevo código',
        cancelButtonText: 'Volver al inicio',
        confirmButtonColor: '#3085d6',
      }).then((result) => {
        if (result.isConfirmed) {
          // Intentar reenviar el código
          handleResendCode();
        } else {
          // Volver al formulario de inicio
          setShowVerification(false);
        }
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await axios.post(`${API_URL}/usuarios/verificar-codigo`, {
        correo: userInfo.correo,
        codigo: verificationCode,
        tempToken: tempToken
      });
      
      if (res.data.token) {
        // Guardar información de sesión
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("sessionId", res.data.sessionId || "");
        localStorage.setItem("usuario", JSON.stringify(res.data.usuario));
        localStorage.setItem("type", res.data.usuario.type);
        localStorage.setItem("nombre", res.data.usuario.nombre || "Usuario");
        
        showSuccessAlert("Verificación exitosa", () => {
          navigate("/");
        });
      } else {
        const errorMsg = "No se pudo completar la verificación.";
        setError(errorMsg);
        showErrorAlert(errorMsg);
      }
    } catch (error) {
      console.error("Error al verificar código:", error);
      
      // Manejo específico para token expirado
      if (error.response?.status === 401 && error.response?.data?.mensaje?.includes('expirado')) {
        Swal.fire({
          icon: 'warning',
          title: 'Token expirado',
          text: 'El token de verificación ha expirado. ¿Deseas solicitar un nuevo código?',
          showCancelButton: true,
          confirmButtonText: 'Solicitar nuevo código',
          cancelButtonText: 'Volver al inicio',
          confirmButtonColor: '#3085d6',
        }).then((result) => {
          if (result.isConfirmed) {
            // Intentar reenviar el código
            handleResendCode();
          } else {
            // Volver al formulario de inicio
            setShowVerification(false);
          }
        });
      } else {
        const errorMsg = error.response?.data?.mensaje || "Error al verificar el código. Intenta nuevamente.";
        setError(errorMsg);
        showErrorAlert(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Función para reenviar el código
  const handleResendCode = async () => {
    if (!userInfo?.correo) {
      setError("Información de correo no disponible");
      showErrorAlert("Información de correo no disponible");
      return;
    }
    
    setLoading(true);
    
    try {
      // Si el token ha expirado, primero solicitamos uno nuevo
      if (!tempToken) {
        // Para Google login
        if (userInfo.googleId) {
          // Mostrar mensaje y volver a la pantalla de inicio de sesión
          Swal.fire({
            icon: 'warning',
            title: 'Sesión expirada',
            text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente con Google.',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#3085d6',
          });
          setShowVerification(false);
          return;
        } 
        // Para login normal
        else {
          // Solicitar nuevo token temporal
          const loginResponse = await axios.post(`${API_URL}/usuarios/login-codigo`, {
            correo: userInfo.correo,
            contraseña: formData.contraseña
          });
          
          if (loginResponse.data.tempToken) {
            setTempToken(loginResponse.data.tempToken);
            setSessionId(loginResponse.data.sessionId || "");
            
            // Ahora con el nuevo token, solicitar un nuevo código
            const resendResponse = await axios.post(`${API_URL}/usuarios/reenviar-codigo`, {
              correo: userInfo.correo,
              tempToken: loginResponse.data.tempToken
            });
            
            if (resendResponse.data.success) {
              Swal.fire({
                icon: 'success',
                title: 'Código reenviado',
                text: 'Hemos enviado un nuevo código de verificación a tu correo electrónico.',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#3085d6',
              });
            }
          }
        }
      } 
      // Si el token existe, intentamos reenviar normalmente
      else {
        try {
          const res = await axios.post(`${API_URL}/usuarios/reenviar-codigo`, {
            correo: userInfo.correo,
            tempToken: tempToken
          });
          
          if (res.data.success) {
            Swal.fire({
              icon: 'success',
              title: 'Código reenviado',
              text: 'Hemos enviado un nuevo código de verificación a tu correo electrónico.',
              confirmButtonText: 'Entendido',
              confirmButtonColor: '#3085d6',
            });
          }
        } catch (error) {
          // Si obtenemos error de token expirado, solicitamos uno nuevo
          if (error.response?.status === 401) {
            // Si es Google login, debemos volver al inicio
            if (userInfo.googleId) {
              Swal.fire({
                icon: 'warning',
                title: 'Sesión expirada',
                text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente con Google.',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#3085d6',
              });
              setShowVerification(false);
              return;
            }
            
            // Para login normal, intentamos obtener un nuevo token
            const loginResponse = await axios.post(`${API_URL}/usuarios/login-codigo`, {
              correo: userInfo.correo,
              contraseña: formData.contraseña
            });
            
            if (loginResponse.data.tempToken) {
              setTempToken(loginResponse.data.tempToken);
              setSessionId(loginResponse.data.sessionId || "");
              
              const resendResponse = await axios.post(`${API_URL}/usuarios/reenviar-codigo`, {
                correo: userInfo.correo,
                tempToken: loginResponse.data.tempToken
              });
              
              if (resendResponse.data.success) {
                Swal.fire({
                  icon: 'success',
                  title: 'Código reenviado',
                  text: 'Hemos enviado un nuevo código de verificación a tu correo electrónico.',
                  confirmButtonText: 'Entendido',
                  confirmButtonColor: '#3085d6',
                });
              }
            }
          } else {
            throw error; // Cualquier otro error se maneja en el catch exterior
          }
        }
      }
    } catch (error) {
      console.error("Error al reenviar código:", error);
      // Si el error es de token expirado o contraseña faltante, mostrar un mensaje específico
      if (error.response?.status === 401 || !formData.contraseña) {
        Swal.fire({
          icon: 'warning',
          title: 'Sesión expirada',
          text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          setShowVerification(false); // Volver al formulario de inicio de sesión
        });
      } else {
        const errorMsg = error.response?.data?.mensaje || "Error al reenviar el código. Intenta nuevamente.";
        setError(errorMsg);
        showErrorAlert(errorMsg);
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
            
            {showVerification ? (
              // Formulario de verificación
              <>
                <h2 className="text-center"><i className="fa-solid fa-shield-halved"></i> Verificación</h2>
                <p className="text-center">Ingresa el código de verificación enviado a tu correo.</p>
                {error && <p className="error text-danger text-center">{error}</p>}
                
                <form onSubmit={handleVerifyCode}>
                  <div className="form-group mb-3">
                    <label className="form-label">Código de verificación:</label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={handleVerificationCodeChange}
                      placeholder="Ingresa el código de 6 dígitos"
                      className="form-control"
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="btn-color w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <span>
                        <i className="fas fa-spinner fa-spin me-2"></i>Verificando...
                      </span>
                    ) : "Verificar"}
                  </button>
                  
                  <button
                    type="button"
                    className="btn btn-outline-secondary w-100"
                    onClick={handleResendCode}
                    disabled={loading}
                  >
                    Reenviar código
                  </button>
                </form>
              </>
            ) : (
              // Formulario de registro
              <>
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
              </>
            )}
            
            <hr className="my-4" />
            <p className="text-center">¿Ya tienes cuenta? <Link to="/Inicio">Inicia sesión</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;