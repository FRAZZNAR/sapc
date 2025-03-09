import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";  // Make sure you have axios installed
import "./Inise.css";
import regImg from "./Img/Reg1.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4008";

const Inicio = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    correo: "",
    contraseña: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { correo, contraseña } = formData;

    if (!correo || !contraseña) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/usuarios/login`, {
        correo,
        contraseña,
      });

      // Verificar que la respuesta tiene los datos correctos
      if (response.data.token) {
        // Guardar el token y los detalles del usuario en localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("usuario", JSON.stringify(response.data.usuario));

        setError("");  // Limpiar el error

        alert("Inicio exitoso");
        navigate("/Panel"); // Redirigir al panel después de iniciar sesión
      } else {
        setError("Hubo un problema con el inicio de sesión.");
      }
    } catch (error) {
      console.error("Error de login:", error);
      setError(error.response?.data.mensaje || "Error al iniciar sesión. Intenta nuevamente.");
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center">
      <div className="row w-100 h-100">
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <img
            src={regImg}
            alt="Inicio"
            className="img-fluid rounded"
            style={{ maxHeight: "600px", objectFit: "contain", borderRadius: "50px" }}
          />
        </div>
        <div className="col-md-4 d-flex justify-content-center align-items-center">
          <div className="card shadow-lg p-4 w-75">
            <i
              className="fa-regular fa-circle-left"
              onClick={() => navigate("/")}
              style={{ cursor: "pointer", fontSize: "24px", color: "#000000" }}
            ></i>
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
                />
              </div>
              <button
                type="submit"
                className="btn btn-block w-100 mb-3"
                style={{ backgroundColor: "#C4E2E2", color: "black" }}
              >
                Iniciar sesión
              </button>

              <button
                type="button"
                className="btn btn-danger btn-block w-100 mb-3"
                onClick={() => navigate("/Panel")}
              >
                <FontAwesomeIcon icon={faGoogle} /> Iniciar sesión con Google
              </button>
            </form>

            <div className="text-center">
              <hr />
              <p>¿No tienes cuenta? <a href="/Registro">Regístrate</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inicio;
