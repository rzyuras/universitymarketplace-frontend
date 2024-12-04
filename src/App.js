import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProfilePage from './pages/ProfilePage';
import MarketplacePage from './pages/MarketplacePage';
import TutoringSessions from './components/TutoringSessions';
import Navbar from './components/Navbar';
import ProtectedRoute from './pages/ProtectedRoute';
import { useAuth0 } from '@auth0/auth0-react';

function App() {
  const { isAuthenticated } = useAuth0();
  const isAuth = localStorage.getItem('isAuth');

  return (
    <>
      <Navbar /> {/* Ahora la Navbar siempre se mostrará */}
      <Routes>
        {/* Ruta principal condicional */}
        <Route path="/" element={
          isAuth === "true" ? <MarketplacePage /> : <Home />
        } />
        
        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/tutorias" element={<TutoringSessions />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          
        </Route>
      </Routes>
    </>
  );
}

export default App;