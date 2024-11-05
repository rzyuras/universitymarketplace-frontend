import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

const LogoutButton = () => {
    const { isAuthenticated, logout, getIdTokenClaims } = useAuth0();

    const fetchToken = async () => {
        try {
            const tokenClaims = await getIdTokenClaims();
            const token = tokenClaims?.__raw;
            if (token) {
                localStorage.setItem("token", token);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        logout();
    };
    useEffect(() => {
        fetchToken();
    }, [isAuthenticated]);
    return <button onClick={() => handleLogout()}>Cerrar sesión</button>;
};

export default LogoutButton;