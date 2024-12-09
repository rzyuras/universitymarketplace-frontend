import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProfilePage from './pages/ProfilePage';
import MarketplacePage from './pages/MarketplacePage';
import Navbar from './components/Navbar';
import ProtectedRoute from './pages/ProtectedRoute';
import { useAuth0 } from '@auth0/auth0-react';
import CreateProductPage from './pages/CreateProductPage';

function App() {
  const { isAuthenticated } = useAuth0();
  const isAuth = localStorage.getItem('isAuth');

  return (
    <>
      <Navbar /> {/* Ahora la Navbar siempre se mostrará */}
      <Routes>
        {/* Ruta principal condicional */}
        <Route path="/" element={
          isAuthenticated === true ? <MarketplacePage /> : <Home />
        } />
        
        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/crear-producto" element={<CreateProductPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;