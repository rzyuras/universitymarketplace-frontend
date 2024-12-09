import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import axios from "axios";
import { useAuth } from './hooks/useAuth';

const LogoutButton = () => {
    const { logout } = useAuth0();
    // const apiUrl = process.env.REACT_APP_API_URL;
    useAuth(); // Usa el hook personalizado

    const handleLogout = () => {
        localStorage.clear();
        logout();
    };

    return <button onClick={() => handleLogout()}>Cerrar sesión</button>;
};

export default LogoutButton;