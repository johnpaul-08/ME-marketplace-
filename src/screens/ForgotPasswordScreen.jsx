import React, { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import BackButton from '../components/BackButton';
import '../styles/Auth.css';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="auth-container" style={{ flexDirection: 'column' }}>
      <BackButton />
      <div className="auth-card">
        <h2>Reset Password</h2>
        {!submitted ? (
          <>
            <p>Enter your email and we'll send you a link to reset your password.</p>
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
              <button type="submit" className="auth-btn">
                Send Reset Link <ArrowRight size={18} />
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📧</div>
            <h3>Check your email</h3>
            <p>We've sent a password reset link to <strong>{email}</strong>.</p>
            <button className="auth-btn" onClick={() => setSubmitted(false)} style={{ marginTop: '20px' }}>
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
