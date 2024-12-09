import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const API_URL = process.env.REACT_APP_API_URL;

export const useUser = () => {
  const { user, isAuthenticated, getIdTokenClaims } = useAuth0();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrCreateUser = async () => {
      if (isAuthenticated && user?.email) {
        try {
          const tokenClaims = await getIdTokenClaims();
          const token = tokenClaims?.__raw;
          //const response = await fetch(`https://universitymarketplace-backend.onrender.com/users`);
          const response = await fetch(`${API_URL}/users`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          
          console.log('Usuario auth0:', user);
          console.log('Usuarios del backend:', data);
          
          const currentUser = data.find((u) => u.email.toLowerCase() === user.email.toLowerCase());
          if (currentUser) {
            console.log('Usuario encontrado:', currentUser);
            console.log(currentUser.id);
            setUserId(currentUser.id);
          } else {
            setError("No se encontró coincidencia.");
            console.error("No se encontró coincidencia.", {
              authEmail: user.email,
              availableEmails: data.map(u => u.email)
            });
          }
        } catch (error) {
          setError(error.message);
          console.error("Error:", error);
        } finally {
          setLoading(false);
        }
      }
    };
  
    fetchOrCreateUser();
  }, [isAuthenticated, user]);

  return { userId, loading, error };
};