import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();
    localStorage.setItem("isAuth", "false");
    const handleLogin = async () => {
        localStorage.setItem("isAuth", "true");
        await loginWithRedirect();

    }
    return <button onClick={() => handleLogin()}>Iniciar sesión</button>;
};

export default LoginButton;