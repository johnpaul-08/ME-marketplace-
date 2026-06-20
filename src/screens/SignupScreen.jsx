import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import BackButton from '../components/BackButton';
import '../styles/Auth.css';

const SignupScreen = ({ onSignup }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate signup
    onSignup();
  };

  return (
    <div className="auth-container" style={{ flexDirection: 'column' }}>
      <BackButton />
      <div className="auth-card">
        <h2>Join ME Marketplace</h2>
        <p>Create an account and shop with purpose</p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <User size={18} />
            <input 
              type="text" 
              placeholder="Full Name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
            />
          </div>

          <div className="input-group">
            <Mail size={18} />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>
          
          <div className="input-group">
            <Lock size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>

          <div className="input-group">
            <Lock size={18} />
            <input 
              type="password" 
              placeholder="Confirm Password" 
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required 
            />
          </div>
          
          <button type="submit" className="auth-btn">
            Create Account <ArrowRight size={18} />
          </button>
        </form>
        
        <p className="auth-footer">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignupScreen;
