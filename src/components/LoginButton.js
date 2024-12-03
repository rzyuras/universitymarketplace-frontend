import { useAuth0 } from "@auth0/auth0-react";
import { useAuth } from './hooks/useAuth';

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();
    useAuth(); // Usa el hook personalizado

    const handleLogin = async () => {
        await loginWithRedirect();
    }

    return <button onClick={handleLogin}>Iniciar sesión</button>;
};

export default LoginButton;