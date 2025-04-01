import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "https://gateway-41642489028.us-central1.run.app";

export const useSessionControl = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = async (e) => {
      if (e.key === 'sessionId' || e.key === 'token') {
        const token = localStorage.getItem('token');
        const sessionId = localStorage.getItem('sessionId');

        if (token && sessionId) {
          try {
            // Verificar validez de la sesión con el backend
            await axios.post(`${API_URL}/usuarios/verificar-sesion`, 
              { sessionId },
              { 
                headers: { 
                  'Authorization': `Bearer ${token}`,
                  'X-Session-Id': sessionId 
                } 
              }
            );
          } catch (error) {
            localStorage.clear();
            
            Swal.fire({
              icon: 'warning',
              title: 'Sesión Cerrada',
              text: 'Has iniciado sesión en otro dispositivo. Esta sesión será cerrada.',
              confirmButtonText: 'Entendido',
              customClass: {
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                confirmButton: 'swal-custom-button'
              }
            }).then(() => {
              navigate('/login');
            });
          }
        }
      }
    };

    // Listener para cambios entre pestañas
    window.addEventListener('storage', handleStorageChange);

    // Configurar interceptor de Axios para manejar errores de autorización
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);
};