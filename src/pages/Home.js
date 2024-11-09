import React, { useEffect } from 'react';
import LoginButton from '../components/LoginButton';
import WebSocketComponent  from '../components/WebSocketComponent';
import { useAuth0 } from '@auth0/auth0-react';
import { FaFutbol } from 'react-icons/fa';

const Home = () => {
  const { isAuthenticated } = useAuth0();
  const isAuth = localStorage.getItem('isAuth');

  useEffect(() => {
    console.log('isAuthenticated:', isAuth);
    }, [isAuthenticated]);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>
        {isAuth === "false" ? <FaFutbol style={{ marginRight: '10px' }} /> : null}
        {isAuth === "true" ? '¡Bienvenido de nuevo!' : '¡Bienvenido a University Marketplace!'}
      </h1>
      <h3>
        {isAuth === "true"
          ? '¡Disfruta del material de estudio disponible para ti!'
          : '¡Inicia sesión ver todo el material de estudio disponible!'}
      </h3>
      <WebSocketComponent />
      {isAuth === "false" && <LoginButton />}
    </div>
  );
};

export default Home;