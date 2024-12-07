import { useAuth0 } from "@auth0/auth0-react";
import { useAuth } from './hooks/useAuth';

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    const handleLogin = async () => {
        await loginWithRedirect();
    }

    return <button onClick={handleLogin}>Iniciar sesión</button>;
};

export default LoginButton;