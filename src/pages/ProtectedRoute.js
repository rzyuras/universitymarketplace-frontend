import { Outlet, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth0();
    const authStatus = localStorage.getItem("isAuth");
    if (authStatus !== "true") {
        console.log("authStatus", authStatus);
        return <Navigate to="/" />;
    }
    return <Outlet />;
};

export default ProtectedRoute;