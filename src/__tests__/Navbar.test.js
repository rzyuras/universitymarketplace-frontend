import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import Navbar from '../components/Navbar';

// Mock de Auth0
jest.mock('@auth0/auth0-react');
const mockedUseAuth0 = useAuth0;

// Mock de Axios
jest.mock('axios');

// Mock de useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockNavigate = jest.fn(); // Crea una función simulada

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // Resetea los mocks antes de cada test
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    // Configura el mock de useAuth0 para simular un usuario no autenticado por defecto
    mockedUseAuth0.mockReturnValue({
      isAuthenticated: false,
      loginWithRedirect: jest.fn(),
      logout: jest.fn(),
      user: null,
      isLoading: false,
    });

    // Configura el mock de axios para evitar llamadas reales
    axios.get.mockResolvedValue({ data: { name: 'John Doe', email: 'john.doe@example.com' } });
  });

  test('renders the navbar with title and unauthenticated buttons', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Verifica que el título está presente
    expect(screen.getByText(/Marketplace Universitario/i)).toBeInTheDocument();

    // Verifica que el botón "Inicio" está presente
    const inicioButton = screen.getByText(/Inicio/i);
    expect(inicioButton).toBeInTheDocument();
  });

  test('renders authenticated user buttons when logged in', async () => {
    // Simula que el usuario está autenticado
    mockedUseAuth0.mockReturnValueOnce({
      isAuthenticated: true,
      loginWithRedirect: jest.fn(),
      logout: jest.fn(),
      getIdTokenClaims: jest.fn(() => Promise.resolve({ token: 'mockToken' })),
      user: { name: 'ejemplo@uc.cl', email: 'ejemplo@uc.cl' },
      isLoading: false,
    });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Verifica que los botones específicos para usuarios autenticados estén presentes
    expect(screen.getByText(/Crear Producto/i)).toBeInTheDocument();
    expect(screen.getByText(/Perfil/i)).toBeInTheDocument();
  });

  test('calls navigate when buttons are clicked', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
  
    // Simula el click en el botón "Inicio"
    fireEvent.click(screen.getByText(/Inicio/i));
    expect(mockNavigate).toHaveBeenCalledWith('/'); // Verifica que se llame con "/"
  });
});
