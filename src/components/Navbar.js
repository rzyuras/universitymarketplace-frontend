import { useAuth0 } from '@auth0/auth0-react';
import LogoutButton from './LogoutButton';
import TutoringSessions from './TutoringSessions';
import { useNavigate } from 'react-router-dom';
import { FaFutbol } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const { isAuthenticated } = useAuth0();
    const isAuth = localStorage.getItem('isAuth');

    const navigate = useNavigate();
    console.log("NAVBAR", isAuthenticated, isAuth);
    
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <button onClick={() => navigate('/')}>Inicio</button>
            </div>
            
            <div className="navbar-center">
                <span className="navbar-title">Marketplace Universitario</span>
            </div>
            <div className="navbar-left">
                <button onClick={() => navigate('/tutorias')}>Agregar Tutoria</button>
                
            </div>
            <div className="navbar-right">
            {isAuthenticated && (
                <>
                    <button onClick={() => navigate('/crear-producto')}>Crear Producto</button>
                    <button onClick={() => navigate('/perfil')}>Perfil</button>
                    <LogoutButton />
                </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;