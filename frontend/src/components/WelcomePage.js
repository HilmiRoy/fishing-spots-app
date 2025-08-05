import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import './WelcomePage.css';

const WelcomePage = () => {
    return (
        <div className="welcome-page">
            <Navigation />
            <div className="welcome-hero">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            Discover Amazing 
                            <span className="gradient-text"> Fishing Spots</span>
                        </h1>
                        <p className="hero-subtitle">
                            Join thousands of anglers sharing their secret spots, 
                            techniques, and catches with the community.
                        </p>
                        <div className="hero-features">
                            <div className="feature">
                                <span className="feature-icon">📍</span>
                                <span>Discover new spots</span>
                            </div>
                            <div className="feature">
                                <span className="feature-icon">🎣</span>
                                <span>Share your best spots </span>
                            </div>
                            <div className="feature">
                                <span className="feature-icon">🗺️</span>
                                <span>Get directions</span>
                            </div>
                        </div>
                        <div className="hero-buttons">
                            <Link to="/signup" className="btn-primary">
                                Get Started
                                <span className="btn-arrow">→</span>
                            </Link>
                            <Link to="/login" className="btn-secondary">
                                Login
                            </Link>
                        </div>
                    </div>
                    <div className="hero-image">
                        <div className="floating-card">
                            <div className="card-header">
                                <span className="card-icon">🎣</span>
                                <span className="card-title">Tasik Kenyir</span>
                            </div>
                            <div className="card-content">
                                <div className="card-rating">
                                    ⭐⭐⭐⭐⭐ 4.8
                                </div>
                                <div className="card-fish">🐟 Sebarau, Toman, Baung</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="welcome-stats">
                <div className="stat">
                    <div className="stat-number">1,200+</div>
                    <div className="stat-label">Fishing Spots</div>
                </div>
                <div className="stat">
                    <div className="stat-number">5,000+</div>
                    <div className="stat-label">Happy Anglers</div>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;