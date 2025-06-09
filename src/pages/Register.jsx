// src/components/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
//import 'src/styles/Register.css'; // Ensure you have the correct path to your CSS file


// Replace the following object with your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBt62MH8GO6nCsbneUO9PWU6mFqM4LFUD8",
  authDomain: "tn-events-6d065.firebaseapp.com",
  projectId: "tn-events-6d065",
    storageBucket: "tn-events-6d065.firebasestorage.app",
  messagingSenderId: "879311163304",
  appId: "1:879311163304:web:d50c73efe025234886179d",
  // ... other config values as needed
};

// Initialize Firebase app and auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
//export { auth };

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate               = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes('@') || password.length < 6 || !username) {
      setError("Invalid details. Please check your inputs.");
      return;
    }
    // Simulated registration logic
    setTimeout(() => navigate('/login'), 500);
  };

  // Function to handle Google Sign In
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // You can access additional info from result.user if needed
      // For now, we simply redirect to the home page
      navigate('/');
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Create a New Account</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input 
          type="text" 
          placeholder="Enter your username"
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <label>Email</label>
        <input 
          type="email" 
          placeholder="Enter your email"
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <label>Password</label>
        <input 
          type="password" 
          placeholder="Enter your password"
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">Register</button>
      </form>
      <hr style={{ margin: '20px 0' }} />
      <button onClick={handleGoogleSignIn} className="google-btn">
        Sign in with Google
      </button>
    </div>
  );
}

export default Register;
