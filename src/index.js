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


const AdminRoute = ({ children }) => {
  const userType = localStorage.getItem('type');
  console.log("Current user type:", userType);
  return (userType && userType === 'admin') ? children : <Navigate to="/Inicio" />;
};

const UserRoute = ({ children }) => {
  return children;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/Inicio" element={<Inicio />} />
        <Route path="/Registro" element={<Registro />} />
        
        <Route path="/Panel" element={<AdminRoute><Panel /></AdminRoute>} />
        <Route path="/GestionUsuarios" element={<AdminRoute><GestionUsuarios /></AdminRoute>} />
        <Route path="/HistorialIniSec" element={<AdminRoute><HistorialIniSec /></AdminRoute>} />
        <Route path="/Popularidad" element={<AdminRoute><Popularidad /></AdminRoute>} />
        <Route path="/Importar" element={<AdminRoute><Importar /></AdminRoute>} />
        
        <Route path="/HistorialBusqueda" element={<UserRoute><HistorialBusqueda /></UserRoute>} />
        <Route path="/EditarPerfil" element={<UserRoute><EditarPerfil /></UserRoute>} />
        <Route path="/Resultados" element={<UserRoute><Resultados /></UserRoute>} />
        
        <Route path="/Header" element={<Header />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

reportWebVitals();