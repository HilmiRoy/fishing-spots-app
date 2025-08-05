import React from 'react';
import Navigation from '../components/Navigation';
import './AboutPage.css';

const AboutPage = () => {
    return (
        <div className="about-page">
            <Navigation />
            <div className="about-container">
                <div className="about-hero">
                    <h1 className="about-title">About <span className="gradient-text">Us</span></h1>
                    <p className="about-intro">
                        Welcome to Fishing Spots!<br/>
                        We are passionate anglers and explorers, building a community where everyone can share, discover, and enjoy the best fishing locations. Our mission is to connect people through the love of fishing and the spirit of adventure.
                    </p>
                    <div className="about-cta">
                        <span className="cta-icon">🌊</span>
                        <h2 className="cta-title">Join Our Community!</h2>
                        <p className="cta-desc">Share your favorite spots, learn new techniques, and make friends who love fishing as much as you do.</p>
                        <a href="/signup" className="cta-btn">Get Started</a>
                    </div>
                </div>
                
                <div className="about-content">
                    <div className="about-section">
                        <div className="section-icon">🎯</div>
                        <h2>Our Mission</h2>
                        <p>
                            To build a thriving community-driven platform where fishing enthusiasts can 
                            discover new spots, share their experiences, and connect with fellow anglers. 
                            We believe that the best fishing spots are discovered through shared knowledge 
                            and community collaboration.
                        </p>
                    </div>

                    <div className="about-section">
                        <div className="section-icon">⭐</div>
                        <h2>What We Offer</h2>
                        <div className="features-grid">
                            <div className="feature-item">
                                <span className="feature-emoji">📍</span>
                                <h3>Spot Discovery</h3>
                                <p>Find amazing fishing locations shared by our community</p>
                            </div>
                            <div className="feature-item">
                                <span className="feature-emoji">🗺️</span>
                                <h3>Interactive Maps</h3>
                                <p>Get detailed directions with Google Maps integration</p>
                            </div>
                            <div className="feature-item">
                                <span className="feature-emoji">🐟</span>
                                <h3>Species Information</h3>
                                <p>Learn about fish species, bait, and techniques</p>
                            </div>
                            <div className="feature-item">
                                <span className="feature-emoji">👥</span>
                                <h3>Community Reviews</h3>
                                <p>Read and share experiences with other anglers</p>
                            </div>
                        </div>
                    </div>

                    <div className="about-section">
                        <div className="section-icon">🏆</div>
                        <h2>Quality Assurance</h2>
                        <p>
                            All shared fishing spots are carefully reviewed and verified by our dedicated 
                            admin team to ensure accuracy and quality. We maintain high standards to 
                            provide you with reliable and up-to-date information.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;