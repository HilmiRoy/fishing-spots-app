import React from 'react';
import './HomePage.css';
import FishingSpotList from '../components/FishingSpotList';
import { useHistory } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from '../firebase';

const HomePage = () => {
    const history = useHistory();

    const handleLogout = async () => {
        await signOut(auth);
        history.push('/login');
    };

    return (
        <div className="home-page stylish-bg">
            <header className="home-header">
                <div className="header-content">
                    <span className="header-icon">🎣</span>
                    <h1 className="header-title">Fishing Spots</h1>
                </div>
                <div className="logout-btn-wrap">
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>
            <main className="home-main">
                <FishingSpotList />
            </main>
        </div>
    );
};

export default HomePage;