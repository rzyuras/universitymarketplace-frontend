import React from 'react';
import ItemList from './components/ItemList';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar';
import ProtectedRoute from './pages/ProtectedRoute';
import { useAuth0 } from '@auth0/auth0-react';

function App() {
  const { isAuthenticated } = useAuth0();
  const isAuth = localStorage.getItem('isAuth');
  return (
    // <div className="App">
    //   <div>
    //     <h1>University Marketplace UC</h1>
    //   </div>
    //   <WebSocketComponent />
    // </div>
    <>
      {isAuth === "true" && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/perfil" element={<ProfilePage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
