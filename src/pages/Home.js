import React from 'react';
import LoginButton from '../components/LoginButton';
import WebSocketComponent from '../components/WebSocketComponent';
import { FaFutbol } from 'react-icons/fa';
import { Navigate } from 'react-router-dom';

const Home = () => {
  const isAuth = localStorage.getItem('isAuth');

  // Si el usuario está autenticado, redirigir al marketplace
  if (isAuth === "true") {
    return <Navigate to="/marketplace" replace />;
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>
        <FaFutbol style={{ marginRight: '10px' }} />
        ¡Bienvenido a University Marketplace!
      </h1>
      <h3>
        ¡Inicia sesión para ver todo el material de estudio disponible!
      </h3>
      <WebSocketComponent />
      <LoginButton />
    </div>
  );
};

export default Home;