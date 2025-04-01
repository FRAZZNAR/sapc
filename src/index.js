import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import App from "./App";
import Inicio from "./Inicio";
import Registro from "./Registro";
import Panel from "./Panel";
import reportWebVitals from "./reportWebVitals";
import HistorialBusqueda from "./HistorialBusqueda";
import EditarPerfil from "./EditarPerfil";
import HistorialIniSec from "./HistorialIniSec";
import GestionUsuarios from "./GestionUsuarios";
import Popularidad from "./Popularidad";
import Resultados from "./Resultados";
import Header from './Header';
import Importar from './Importar';
import NotFound from './404'; 
import {GoogleOAuthProvider} from '@react-oauth/google'

const CLIENT_ID = "41642489028-cdvs8dcjnj4fc7rug2ga4sup1o1s1pum.apps.googleusercontent.com"

// Componente de ruta protegida
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('type');

  // Si no hay token, redirige al inicio de sesión
  if (!token) {
    return <Navigate to="/Inicio" replace />;
  }

  // Si es ruta de admin y no es admin, redirige
  if (adminOnly && userType !== 'admin') {
    return <Navigate to="/Inicio" replace />;
  }

  return children;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/Inicio" element={<Inicio />} />
        <Route path="/Registro" element={<Registro />} />
        
        {/* Rutas protegidas con validación de token */}
        <Route path="/" element={<ProtectedRoute><App /></ProtectedRoute>} />
        
        {/* Rutas de admin */}
        <Route path="/Panel" element={<ProtectedRoute adminOnly={true}><Panel /></ProtectedRoute>} />
        <Route path="/GestionUsuarios" element={<ProtectedRoute adminOnly={true}><GestionUsuarios /></ProtectedRoute>} />
        <Route path="/HistorialIniSec" element={<ProtectedRoute adminOnly={true}><HistorialIniSec /></ProtectedRoute>} />
        <Route path="/Popularidad" element={<ProtectedRoute adminOnly={true}><Popularidad /></ProtectedRoute>} />
        <Route path="/Importar" element={<ProtectedRoute adminOnly={true}><Importar /></ProtectedRoute>} />
        
        {/* Rutas de usuario */}
        <Route path="/HistorialBusqueda" element={<ProtectedRoute><HistorialBusqueda /></ProtectedRoute>} />
        <Route path="/EditarPerfil" element={<ProtectedRoute><EditarPerfil /></ProtectedRoute>} />
        <Route path="/Resultados" element={<ProtectedRoute><Resultados /></ProtectedRoute>} />
        
        {/* Otras rutas */}
        <Route path="/Header" element={<Header />} />
        
        {/* Ruta 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

reportWebVitals();