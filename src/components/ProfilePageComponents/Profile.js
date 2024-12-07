import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
    const { user, isAuthenticated, getIdTokenClaims } = useAuth0();

    localStorage.setItem("isAuth", isAuthenticated.toString());
    localStorage.setItem("user", JSON.stringify(user));
    console.log("user picture", user.picture);
    
    return (
        isAuthenticated !== '' ? (
        <div style={{marginTop: '80px'}}>
            <h1>Perfil</h1>
            <img src={user?.picture} alt={user?.name} />
            <h2>Nombre: {user?.name}</h2>
            <h2>Email: {user?.email}</h2>
        </div>
        ) : null
    );
};

export default Profile;