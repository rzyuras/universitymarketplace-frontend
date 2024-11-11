import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import axios from "axios";

const LogoutButton = () => {
    const { isAuthenticated, user, logout, getIdTokenClaims } = useAuth0();
    const apiUrl = process.env.REACT_APP_API_URL;

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

    const AddUserToBDD = async () => {
        try {
            const email = user?.email;
            const name = user?.name;
            console.log("Agregando...")
            console.log("email", email);
            console.log("name", name);
            const response = await axios.post(`${apiUrl}/users`, {
                email: email,
                full_name: name,
                is_tutor: true,
            });
            console.log("response", response);
            localStorage.setItem("user_id", response["data"]["id"]);
            console.log("user_id", response["data"]["id"]);
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
        if (user) {
            AddUserToBDD();
        }
    }, [isAuthenticated]);

    return <button onClick={() => handleLogout()}>Cerrar sesión</button>;
};

export default LogoutButton;