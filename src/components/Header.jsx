import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import logo from '../assets/logo.png'; // update the path if needed

export default function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="header-container">
      <div className="logo-container">
        <img src={logo} alt="AuraSnap Logo" className="logo" />
      </div>

      <div className="header-right">
    
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
