import React, { useRef } from 'react';
import { Container, Button, Table } from 'react-bootstrap';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Header from './Header';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Resultados = () => {
  const pdfRef = useRef(); 

  const options = {
    chart: {
      type: 'pie'
    },
    title: {
      text: 'Percepción'
    },
    series: [{
      name: 'Cantidad',
      data: [
        { name: 'Aceptación', y: 290, color: '#28a745' },
        { name: 'Indiferencia', y: 250, color: '#FFD700' },
        { name: 'Rechazo', y: 160, color: '#FF0000' }
      ]
    }]
  };

  const handleDownloadPDF = () => {
    const input = pdfRef.current; // Elemento a capturar en PDF

    html2canvas(input, { scale: 3 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4'); // 'l' para horizontal

      // Tamaño de la página A4 en horizontal (297mm x 210mm)
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Ajustamos la imagen para que ocupe toda la página sin márgenes
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Dibujamos la imagen ocupando toda la hoja
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('resultados.pdf');
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

      {/* Contenido que se convertirá en PDF */}
      <div ref={pdfRef} style={{ padding: '20px', backgroundColor: 'white' }}>
        <Container className="mt-5 text-center">
          <h1
            className="text-dark py-4 rounded shadow-sm fw-bold"
            style={{
              backgroundColor: '#E1E1E1',
              fontSize: '3rem', // Aumentamos el tamaño de letra
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              maxWidth: '1000px',
              margin: '0 auto'
            }}
          >
            Andrés Manuel López Obrador
          </h1>
        </Container>

        <Container className="mt-3 text-center">
          <h3 className="text-center"
            style={{
              backgroundColor: '#C4E2E2',
              fontSize: '2.5rem', // Más grande
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              maxWidth: '1000px',
              margin: '2 auto'
            }}
          >Pensiones</h3>
        </Container>

        <Container className="mt-4 w-75 mx-auto">
          <Table bordered hover striped>
            <thead>
              <tr>
                <th>Aceptación</th>
                <th>Indiferencia</th>
                <th>Rechazo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>290</td>
                <td>250</td>
                <td>160</td>
              </tr>
            </tbody>
          </Table>
        </Container>

        <Container className="mt-5 text-center">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </Container>
      </div>
    </div>
  );
};

export default Resultados;
