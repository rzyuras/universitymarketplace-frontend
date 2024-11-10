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
            <div className="navbar-logo">
                <FaFutbol />
            </div>
            <ul className="navbar-list">
                <li className="navbar-item">
                    <button onClick={() => navigate('/')}>Inicio</button>
                </li>
                <li className="navbar-item">
                    <button onClick={() => navigate('/perfil')}>Perfil</button>
                </li>
                {isAuthenticated ? (
                    <li className="navbar-item">
                        <LogoutButton />
                    </li>
                ) : null}
            </ul>
        </nav>
    );
};

export default Navbar;