import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import App from '../App';

jest.mock('@auth0/auth0-react');
const mockedUseAuth0 = useAuth0;

jest.mock('../components/Navbar', () => () => <div>Navbar</div>);
jest.mock('../pages/Home', () => () => <div>Home Page</div>);
jest.mock('../pages/MarketplacePage', () => () => <div>Marketplace Page</div>);
jest.mock('../pages/ProfilePage', () => () => <div>Profile Page</div>);
jest.mock('../pages/CreateProductPage', () => () => <div>Create Product Page</div>);

describe('App Component with Protected Routes', () => {
  test('redirects to home page when accessing a protected route without authentication', () => {
    mockedUseAuth0.mockReturnValue({
      isAuthenticated: false,
      loginWithRedirect: jest.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/perfil']}>
        <App />
      </MemoryRouter>
    );

    // Verifica que el usuario es redirigido a la página de inicio
    expect(screen.getByText(/Home Page/i)).toBeInTheDocument();
  });

  test('allows access to protected route when authenticated', () => {
    mockedUseAuth0.mockReturnValue({
      isAuthenticated: true,
      loginWithRedirect: jest.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/perfil']}>
        <App />
      </MemoryRouter>
    );

    // Verifica que la página protegida se renderiza
    expect(screen.getByText(/Profile Page/i)).toBeInTheDocument();
  });
});
