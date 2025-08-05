import React from 'react';
import SignupForm from '../components/SignupForm';
import Navigation from '../components/Navigation';
import './SignupPage.css';

const SignupPage = () => (
  <div className="signup-page">
    <Navigation />
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1 className="signup-title">Join Our Community</h1>
          <p className="signup-subtitle">Create your account to start discovering amazing fishing spots</p>
        </div>
        <SignupForm />
      </div>
    </div>
  </div>
);

export default SignupPage;