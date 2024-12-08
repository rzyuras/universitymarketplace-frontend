import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import CreateProductPage from '../components/CreateProductPage';

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

    // Simula un usuario autenticado
    mockedUseAuth0.mockReturnValue({
      user: { name: 'testuser', email: 'testuser@example.com' },
      isAuthenticated: true,
      isLoading: false,
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
    expect(screen.getByRole('button', { name: /Apunte/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Tutoría/i })).toBeInTheDocument();
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

  test('handles form submission and navigation on success', async () => {
    fetch.mockResolvedValueOnce({ ok: true }); // Simula una respuesta exitosa

    render(
      <BrowserRouter>
        <CreateProductPage />
      </BrowserRouter>
    );

    // Simula rellenar el título
    fireEvent.change(screen.getByLabelText(/Título:/i), { target: { value: 'Nuevo Apunte' } });

    // Simula seleccionar un archivo
    const file = new File(['dummy content'], 'example.pdf', { type: 'application/pdf' });
    fireEvent.change(screen.getByLabelText(/Archivo:/i), { target: { files: [file] } });

    // Simula el envío del formulario
    fireEvent.click(screen.getByRole('button', { name: /Crear Apunte/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/notes/',
        expect.objectContaining({
          method: 'POST',
        })
      );
      expect(mockNavigate).toHaveBeenCalledWith('/marketplace');
    });
  });

  test('shows an error message when submission fails', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 400 });

    render(
      <BrowserRouter>
        <CreateProductPage />
      </BrowserRouter>
    );

    // Simula rellenar el título
    fireEvent.change(screen.getByLabelText(/Título:/i), { target: { value: 'Nuevo Apunte' } });

    // Simula seleccionar un archivo
    const file = new File(['dummy content'], 'example.pdf', { type: 'application/pdf' });
    fireEvent.change(screen.getByLabelText(/Archivo:/i), { target: { files: [file] } });

    // Simula el envío del formulario
    fireEvent.click(screen.getByRole('button', { name: /Crear Apunte/i }));

    await waitFor(() => {
      expect(screen.getByText(/Error al crear el apunte/i)).toBeInTheDocument();
    });
  });
});
