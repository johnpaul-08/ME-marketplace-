import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import BackButton from '../components/BackButton';
import '../styles/Auth.css';

const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login
    onLogin();
  };

  return (
    <div className="auth-container" style={{ flexDirection: 'column' }}>
      <BackButton />
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p>Login to your ME Marketplace account</p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <Mail size={18} />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="input-group">
            <Lock size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <div className="auth-options">
            <label><input type="checkbox" /> Remember me</label>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
          
          <button type="submit" className="auth-btn">
            Login <ArrowRight size={18} />
          </button>
        </form>
        
        <p className="auth-footer">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
