import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export const useAuth = () => {
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    const registerUser = async () => {
      if (isAuthenticated && user) {
        try {
          //const response = await fetch('https://universitymarketplace-backend.onrender.com/users/', {
          const response = await fetch('http://localhost:8000/users/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              full_name: user.name,
              is_tutor: false
            }),
          });

          if (response.ok) {
            localStorage.setItem('isAuth', 'true');
          }
        } catch (error) {
          console.error('Error registering user:', error);
        }
      }
    };

    registerUser();
  }, [isAuthenticated, user]);
};