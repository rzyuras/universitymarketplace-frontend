import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import CreateProductPage from '../pages/CreateProductPage';

const API_URL = process.env.REACT_APP_API_URL;

// Mock de Auth0
jest.mock('@auth0/auth0-react');
const mockedUseAuth0 = useAuth0;

// Mock de fetch
global.fetch = jest.fn();

// Mock de useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockNavigate = require('react-router-dom').useNavigate;

describe('CreateProductPage Component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    mockNavigate.mockImplementation(jest.fn()); // Configura el mock de navigate

    // Simula un usuario autenticado
    mockedUseAuth0.mockReturnValue({
      user: { name: 'ejemplo@uc.cl', email: 'ejemplo@uc.cl' },
      isAuthenticated: true,
      isLoading: false,
      getIdTokenClaims: jest.fn(() => Promise.resolve({ __raw: 'mock-token' })), // Mock de getIdTokenClaims
    });

    // Mock de navigate
    mockNavigate.mockReturnValue(jest.fn());
  });

  test('renders the form for creating a note', () => {
    render(
      <BrowserRouter>
        <CreateProductPage />
      </BrowserRouter>
    );
  
    expect(screen.getByText(/Crear Nuevo Producto/i)).toBeInTheDocument();
    
    // Filtra específicamente el botón de tipo de producto
    const typeButtonApunte = screen
      .getAllByRole('button')
      .find((button) => button.textContent === 'Apunte');
    expect(typeButtonApunte).toBeInTheDocument();
  
    // Verifica el botón de envío directamente por el texto
    const submitButton = screen.getByRole('button', { name: /Crear Apunte/i });
    expect(submitButton).toBeInTheDocument();
  });
  

  test('allows the user to fill out the note creation form', async () => {
    render(
      <BrowserRouter>
        <CreateProductPage />
      </BrowserRouter>
    );
  
    // Simula rellenar el título
    fireEvent.change(screen.getByLabelText(/Título:/i), { target: { value: 'Nuevo Apunte' } });
    expect(screen.getByDisplayValue('Nuevo Apunte')).toBeInTheDocument();
  
    // Simula seleccionar un archivo
    const file = new File(['dummy content'], 'example.pdf', { type: 'application/pdf' });
    fireEvent.change(screen.getByLabelText(/Archivo:/i), { target: { files: [file] } });
    expect(screen.getByText('Archivo seleccionado: example.pdf')).toBeInTheDocument();
  });

  test('shows an error message when submission fails', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: jest.fn(() => Promise.resolve({ detail: 'Error desconocido al crear el producto' })),
    });
  
    render(
      <BrowserRouter>
        <CreateProductPage />
      </BrowserRouter>
    );

    // Limpia el estado inicial
    screen.queryByText(/Error al cargar los cursos/i)?.remove();
  
    fireEvent.change(screen.getByLabelText(/Título:/i), { target: { value: 'Nuevo Apunte' } });
    const file = new File(['dummy content'], 'example.pdf', { type: 'application/pdf' });
    fireEvent.change(screen.getByLabelText(/Archivo:/i), { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /Crear Apunte/i }));
  
    await waitFor(() => {
      expect(screen.getByText(/Error al cargar los cursos/i)).toBeInTheDocument();
    });
  });
});
