// hooks/useUser.js
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const useUser = () => {
  const { user, isAuthenticated } = useAuth0();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchOrCreateUser = async () => {
      if (isAuthenticated && user?.email) {
        try {
          const response = await fetch(`https://universitymarketplace-backend.onrender.com/users`);
          const data = await response.json();
          
          console.log('Usuario auth0:', user);
          console.log('Usuarios del backend:', data);
          
          const currentUser = data.find((u) => u.email.toLowerCase() === user.email.toLowerCase());
          if (currentUser) {
            console.log('Usuario encontrado:', currentUser);
            console.log(currentUser.id);
            setUserId(currentUser.id);
          } else {
            console.error("No se encontró coincidencia.", {
              authEmail: user.email,
              availableEmails: data.map(u => u.email)
            });
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };
  
    fetchOrCreateUser();
  }, [isAuthenticated, user]);

  return userId;
};
