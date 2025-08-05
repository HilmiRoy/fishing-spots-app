import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const SignupForm = ({ onSignupSuccess }) => {
    const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                role: "user",
                createdAt: serverTimestamp()
            });
            onSignupSuccess();
            history.push('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form className="signup-form" onSubmit={handleSignup}>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
            </div>
            <button className="signup-btn" type="submit">Create Account</button>
            <div className="login-prompt">
                <span>Already have an account? </span>
                <button
                    className="login-link"
                    type="button"
                    onClick={() => history.push('/login')}
                >
                    Sign in
                </button>
            </div>
        </form>
    );
};

export default SignupForm;