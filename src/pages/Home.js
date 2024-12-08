import React from 'react';
import LoginButton from '../components/LoginButton';
import { FaFutbol } from 'react-icons/fa';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

const Home = () => {
  const isAuth = localStorage.getItem('isAuth');
  const { isAuthenticated } = useAuth0();

  // Si el usuario está autenticado, redirigir al marketplace
  if (isAuthenticated === true) {
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
      <LoginButton />
    </div>
  );
};

export default Home;