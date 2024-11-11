import { useAuth0 } from '@auth0/auth0-react';
import LogoutButton from './LogoutButton';
import LoginButton from './LoginButton';
import { useNavigate } from 'react-router-dom';
import { FaFutbol } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const { isAuthenticated } = useAuth0();
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <button onClick={() => navigate('/')}>Inicio</button>
            </div>
            
            <div className="navbar-center">
                <span className="navbar-title">Marketplace Universitario</span>
            </div>
            
            <div className="navbar-right">
                <button onClick={() => navigate('/perfil')}>Perfil</button>
                {isAuthenticated && <LogoutButton />}
            </div>
        </nav>
    );
};

export default Navbar;