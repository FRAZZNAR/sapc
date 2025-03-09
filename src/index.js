import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/Inicio" element={<Inicio />} />
        <Route path="/Registro" element={<Registro />} />
        <Route path="/Panel" element={<Panel />} />
        <Route path="/HistorialBusqueda" element={<HistorialBusqueda />} />
        <Route path="/EditarPerfil" element={<EditarPerfil />} />
        <Route path="/HistorialIniSec" element={<HistorialIniSec />} />
        <Route path="/GestionUsuarios" element={<GestionUsuarios />} />
        <Route path="/Popularidad" element={<Popularidad />} />
        <Route path="/Resultados" element={<Resultados />} />
        <Route path="/Header" element={<Header />} />
        <Route path="/Importar" element={<Importar />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
