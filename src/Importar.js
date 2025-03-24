import React, { useState } from 'react';
import { Container, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import NavBar from './NavBar';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import HeaderComponent from './HeaderComponent.js';
import Swal from 'sweetalert2';

const Importar = () => {
  const [user, setUser] = useState('correo@ejemplo.com');
  const [uploadStatus, setUploadStatus] = useState({ show: false, message: '', type: '' });
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'application/xml': ['.xml'],
    },
    onDrop: (acceptedFiles) => {
      handleFileUpload(acceptedFiles[0]);
    },
  });

  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    setUploadStatus({ show: true, message: 'Subiendo archivo...', type: 'info' });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://api-clasificador-41642489028.us-central1.run.app/upload', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();

      if (response.ok) {
        const importedCount = result.importedCount || 'sin registros importados';
        setUploadStatus({
          show: true,
          message: `Subido correctamente`,
          type: 'success',
        });

        // Mostrar alerta con SweetAlert2
        Swal.fire({
          icon: 'success',
          title: 'Subido correctamente',
          confirmButtonText: 'Aceptar',
        });
      } else {
        const errorMessage = result.message || 'Error desconocido';
        setUploadStatus({
          show: true,
          message: `Error: ${errorMessage}`,
          type: 'danger',
        });

        // Mostrar alerta de error con SweetAlert2
        Swal.fire({
          icon: 'error',
          title: 'Error al subir el archivo',
          text: errorMessage,
          confirmButtonText: 'Aceptar',
        });
      }
    } catch (error) {
      setUploadStatus({
        show: true,
        message: `Error al subir el archivo: ${error.message}`,
        type: 'danger',
      });

      // Mostrar alerta de error con SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Error al subir el archivo',
        text: error.message,
        confirmButtonText: 'Aceptar',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <div className="bootstrap-container">
      <NavBar userType={1} />
      <div className="main-content">
        <header className="header">
          <HeaderComponent />
        </header>

        <Container className="mt-4">
          <h1 className="text-center mb-4">Importar archivos</h1>
          {uploadStatus.show && (
            <Alert 
              variant={uploadStatus.type} 
              onClose={() => setUploadStatus({...uploadStatus, show: false})} 
              dismissible
            >
              {uploadStatus.message}
            </Alert>
          )}
        </Container>

        <Container className="mt-4 d-flex justify-content-center">
          <div
            {...getRootProps()}
            style={{
              border: `2px dashed ${isDragActive ? '#007bff' : '#214662'}`,
              padding: '60px',
              textAlign: 'center',
              borderRadius: '10px',
              marginTop: '30px',
              cursor: 'pointer',
              minHeight: '550px',
              width: '80%',
              backgroundColor: isDragActive ? '#e6f7ff' : '#f9f9f9',
              boxShadow: '0px 4px 20px rgba(0, 123, 255, 0.3)',
              transition: 'all 0.3s ease-in-out',
            }}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <div>
                <p style={{ fontSize: '18px', color: '#555' }}>Subiendo archivo...</p>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : (
              <>
                <p style={{ fontSize: '18px', color: '#555' }}>
                  Arrastra y suelta un archivo (.csv, .json, .xml) aquí, o haz clic para seleccionarlo
                </p>
                <div style={{ fontSize: '30px', color: '#007bff', fontWeight: 'bold' }} >
                  ¡Hazlo fácil, carga un archivo!
                  <i className="fa-solid fa-upload" style={{ fontSize: '40px', marginLeft: '15px' }}></i>
                </div>
              </>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Importar;