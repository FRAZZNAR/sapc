import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f7f9fc',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '500px',
        padding: '20px'
      }}>
        {/* 404 Text */}
        <div style={{
          position: 'relative',
          fontSize: '120px',
          fontWeight: 'bold',
          color: '#3b82f6',
          marginBottom: '20px',
          lineHeight: '1'
        }}>
          <div style={{
            position: 'absolute',
            width: '100%',
            textAlign: 'center',
            bottom: '-10px',
            left: '0',
            height: '4px',
            background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent)'
          }}></div>
          404
        </div>
        
        {/* Title */}
        <h1 style={{
          fontSize: '30px',
          fontWeight: '600',
          color: '#1e3a8a',
          marginBottom: '24px'
        }}>
          ¡Página no encontrada!
        </h1>
        
        {/* Description */}
        <p style={{
          fontSize: '18px',
          lineHeight: '1.6',
          color: '#64748b',
          marginBottom: '30px'
        }}>
          La página que estás buscando parece haber sido abducida por alienígenas... O simplemente no existe.
        </p>
        
        {/* SVG OVNI - Más confiable que CSS complejo */}
        <div style={{ margin: '40px auto', width: '150px', height: '80px' }}>
          <svg width="150" height="120" viewBox="0 0 150 120">
            {/* Rayo */}
            <defs>
              <radialGradient id="rayGradient" cx="0.5" cy="0" r="0.5" fx="0.5" fy="0">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
              </radialGradient>
            </defs>
            
            <ellipse cx="75" cy="85" rx="12" ry="60" fill="url(#rayGradient)">
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
            </ellipse>
            
            {/* OVNI grupo con animación */}
            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,-10;0,0;0,-10"
                dur="4s"
                repeatCount="indefinite"
              />
              
              {/* Cuerpo del OVNI */}
              <ellipse cx="75" cy="50" rx="40" ry="10" fill="#3b82f6" />
              <ellipse cx="75" cy="50" rx="30" ry="7" fill="#60a5fa" />
              
              {/* Cúpula */}
              <ellipse cx="75" cy="40" rx="20" ry="20" fill="#93c5fd" />
              <ellipse cx="75" cy="40" rx="12" ry="12" fill="#dbeafe" />
              
              <circle cx="55" cy="50" r="3" fill="#fef3c7">
                <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />
              </circle>
              <circle cx="65" cy="52" r="2" fill="#fef3c7">
                <animate attributeName="opacity" values="1;0.5;1" dur="1.2s" repeatCount="indefinite" />
              </circle>
              <circle cx="85" cy="52" r="2" fill="#fef3c7">
                <animate attributeName="opacity" values="1;0.5;1" dur="0.8s" repeatCount="indefinite" />
              </circle>
              <circle cx="95" cy="50" r="3" fill="#fef3c7">
                <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />
              </circle>
            </g>
          </svg>
        </div>
        
        <Link 
          to="/Inicio"
          style={{
            display: 'inline-block',
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: '500',
            textDecoration: 'none',
            boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(59, 130, 246, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#3b82f6';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(59, 130, 246, 0.2)';
          }}
        >
          Volver a la página principal
        </Link>
      </div>
    </div>
  );
};

export default NotFound;