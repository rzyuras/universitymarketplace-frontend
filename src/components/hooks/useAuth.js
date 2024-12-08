import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const API_URL = process.env.REACT_APP_API_URL;

export const useAuth = () => {
  const { user, isAuthenticated, getIdTokenClaims } = useAuth0();

  useEffect(() => {
    const registerUser = async () => {
      if (isAuthenticated && user) {
        try {
          //const response = await fetch('https://universitymarketplace-backend.onrender.com/users/', {
          const tokenClaims = await getIdTokenClaims();
          const token = tokenClaims?.__raw;
          const response = await fetch(`${API_URL}/users/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              email: user.email,
              full_name: user.name,
              is_tutor: false
            }),
          });

          if (response.ok) {
            localStorage.setItem('isAuth', 'true');
            console.log("Usuario registrado");
          }
        } catch (error) {
          console.error('Error registering user:', error);
        }
      }
    };

    registerUser();
  }, [isAuthenticated, user]);
};