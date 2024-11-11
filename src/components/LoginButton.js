import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import { useEffect } from 'react';
import { API_URL } from '../config';

const API_URL2 = API_URL;

const LoginButton = () => {
    const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

    // Function to create user in backend
    const createUserInBackend = async (userData) => {
        try {
            // Enviar solo los campos que coinciden con UserCreate
            const response = await axios.post(`${API_URL2}/users/`, {
                email: userData.email,
                full_name: userData.name,
                is_tutor: true
            });
            
            console.log('User created in backend:', response.data);
            return response.data;
        } catch (error) {
            if (error.response?.status === 400) {
                // Imprimir el mensaje de error detallado
                console.log('Error 400:', error.response.data);
                if (error.response.data.detail === "Email already registered") {
                    console.log('User already exists in backend');
                    return;
                }
            }
            console.error('Error creating user:', error.response?.data || error);
            throw error;
        }
    };

    // Handle successful login
    const handleLogin = async () => {
        try {
            await loginWithRedirect();
            localStorage.setItem("isAuth", "true");
        } catch (error) {
            console.error('Login error:', error);
            localStorage.setItem("isAuth", "false");
        }
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.setItem("isAuth", "false");
        logout({ returnTo: window.location.origin });
    };

    // Create user in backend after successful Auth0 login
    useEffect(() => {
        const initUser = async () => {
            if (isAuthenticated && user) {
                try {
                    await createUserInBackend(user);
                } catch (error) {
                    console.error('Error initializing user:', error);
                }
            }
        };

        initUser();
    }, [isAuthenticated, user, createUserInBackend]); // Añadido createUserInBackend como dependencia

    return isAuthenticated ? (
        <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
            Cerrar sesión
        </button>
    ) : (
        <button 
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
            Iniciar sesión
        </button>
    );
};

export default LoginButton;