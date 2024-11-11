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
            // Instead of sending Auth0 token, we'll send user data
            const response = await axios.post(`${API_URL2}/users/`, {
                email: userData.email,
                full_name: userData.name,
                password: crypto.randomUUID(), // Random password since Auth0 handles auth
                is_tutor: true
            });
            console.log('User created in backend:', response.data);
            return response.data;
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('User already exists in backend');
            } else {
                console.error('Error creating user:', error);
                throw error;
            }
        }
    };

    // Handle successful login
    const handleLogin = async () => {
        try {
            localStorage.setItem("isAuth", "true");
            await loginWithRedirect();
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
        if (isAuthenticated && user) {
            createUserInBackend(user);
        }
    }, [isAuthenticated, user]);

    return isAuthenticated ? (
        <button onClick={handleLogout}>Cerrar sesión</button>
    ) : (
        <button onClick={handleLogin}>Iniciar sesión</button>
    );
};

export default LoginButton;