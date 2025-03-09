import React, { useState, useRef } from 'react';
import { Container, Button, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Header from './Header';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const HistorialBusqueda = () => {
  const [showAll, setShowAll] = useState(false);
  const pdfRef = useRef(); 

  const temas = [
    { tema: "Andrés Manuel López Obrador", subtema: "Pensiones" },
    { tema: "Andrés Manuel López Obrador", subtema: "Becas" },
    { tema: "Andrés Manuel López Obrador", subtema: "Robo de datos de periodistas" },
    { tema: "Ricardo Anaya Cortés", subtema: "Corrupción" },
    { tema: "Ricardo Anaya Cortés", subtema: "Reformas electorales" },
    { tema: "Claudia Sheinbaum", subtema: "Medio ambiente" },
    { tema: "Claudia Sheinbaum", subtema: "Seguridad" },
    { tema: "Felipe Calderón", subtema: "Guerra contra el narcotráfico" },
    { tema: "Felipe Calderón", subtema: "Reformas energéticas" },
    { tema: "Andrés Manuel López Obrador", subtema: "Constitución de 1917" },
    { tema: "Andrés Manuel López Obrador", subtema: "Plan Nacional de Desarrollo" },
    { tema: "José Antonio Meade", subtema: "Política económica" },
    { tema: "José Antonio Meade", subtema: "Seguridad social" },
    { tema: "Jaime Rodríguez 'El Bronco'", subtema: "Independencia electoral" },
    { tema: "Jaime Rodríguez 'El Bronco'", subtema: "Reformas al sistema político" },
    { tema: "Manuel López Obrador", subtema: "Política de austeridad" },
    { tema: "Marco Cortés", subtema: "Reformas fiscales" },
    { tema: "Marco Cortés", subtema: "Educación" },
    { tema: "PRI", subtema: "Reformas al sector energético" },
    { tema: "PRI", subtema: "Derechos humanos" }
  ];

  const visibleTemas = showAll ? temas : temas.slice(0, 11);

  const handleDownloadPDF = () => {
    const input = pdfRef.current;
    html2canvas(input, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save('Historial_Busqueda.pdf');
    });
  };

  return (
    <div className="bootstrap-container">
      <Header userType={2} />
      <div className="container mt-4">
        <button className="btn btn-dark d-flex align-items-center" onClick={handleDownloadPDF}>
          <span className="fw-bold">Descargar en PDF</span>
          <i className="fa-regular fa-file-pdf ms-2"></i>
        </button>
      </div>

      {/* Contenedor para capturar en PDF */}
      <Container className="mt-4" ref={pdfRef}>
        <Table bordered hover className="table-striped">
          <thead>
            <tr>
              <th className='text-center'>Historial de búsquedas</th>
            </tr>
          </thead>
          <tbody>
            {visibleTemas.map((item, index) => (
              <tr key={index}>
                <td className="text-left p-3">{item.tema} - {item.subtema}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

¿      <Container className="mt-4 text-center">
        <Button 
          style={{ backgroundColor: "#E1E1E1", borderColor: "#E1E1E1", color: "#000" }} 
          onClick={() => setShowAll(!showAll)}>
          {showAll ? "Ver Menos" : "Ver Más"}
        </Button>
      </Container>
    </div>
  );
};

export default HistorialBusqueda;
