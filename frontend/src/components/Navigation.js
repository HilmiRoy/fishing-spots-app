import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    <span className="logo-icon">🎣</span>
                    Fishing Spots
                </Link>
                <div className="nav-menu">
                    <Link 
                        to="/" 
                        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        Home
                    </Link>
                    <Link 
                        to="/about" 
                        className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
                    >
                        About Us
                    </Link>
                    <Link 
                        to="/login" 
                        className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
                    >
                        Login
                    </Link>
                    <Link 
                        to="/signup" 
                        className={`nav-button ${location.pathname === '/signup' ? 'active' : ''}`}
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
