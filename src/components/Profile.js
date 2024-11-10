import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
    const { user, isAuthenticated, getIdTokenClaims } = useAuth0();

    localStorage.setItem("isAuth", isAuthenticated.toString());
    localStorage.setItem("user", JSON.stringify(user));
    
    return (
        isAuthenticated !== '' ? (
        <div style={{marginTop: '80px'}}>
        <img src={user?.picture} alt={user?.name} />
        <h2>{user?.name}</h2>
        </div>
        ) : null
    );
};

export default Profile;