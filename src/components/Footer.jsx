import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Mail, Phone, MapPin } from 'lucide-react';
import '../styles/Footer.css';

// Custom Social Icons since Lucide v1.x removed brand icons
const FacebookIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const InstagramIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const TwitterIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.2-18 11.6 7.2.7 20.2-11 13-15.5 2 0 3.5-1.1 5-2.2 0 0-1.5 1.5-3 2 1.5 0 3-1 3-1z"/></svg>
);

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-info">
            <Logo className="footer-logo" />
            <p className="footer-desc">Shop with purpose. Every purchase from the ME Marketplace directly supports Mind Empowerment's mission of youth empowerment and mental health awareness in India.</p>
            <div className="social-links">
              <a href="https://www.facebook.com/mindempowered" target="_blank" rel="noopener noreferrer"><FacebookIcon size={20} /></a>
              <a href="https://www.instagram.com/mind.empowered" target="_blank" rel="noopener noreferrer"><InstagramIcon size={20} /></a>
              <a href="https://twitter.com/mindempowered" target="_blank" rel="noopener noreferrer"><TwitterIcon size={20} /></a>
            </div>
          </div>
          
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/categories">Communities</Link></li>
              <li><Link to="/best-sellers">Best Sellers</Link></li>
              <li><Link to="/about">About ME</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h4>Support</h4>
            <ul>
              <li><Link to="/track-order">Track Order</Link></li>
              <li><Link to="/contact">Shipping Policy</Link></li>
              <li><Link to="/contact">Refund Policy</Link></li>
              <li><a href="https://mind-empowered.org" target="_blank" rel="noopener noreferrer">Visit mind-empowered.org</a></li>
            </ul>
          </div>
          
          <div className="footer-contact">
            <h4>Get in Touch</h4>
            <ul>
              <li><Mail size={16} /> hello@mind-empowered.org</li>
              <li><Phone size={16} /> +91 98765 43210</li>
              <li><MapPin size={16} /> India</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2026 Mind Empowerment. All rights reserved. Illuminating minds. Transforming lives.</p>
          <div className="payment-icons">
            {/* Mock payment icons */}
            <span className="payment-mock">Visa</span>
            <span className="payment-mock">Mastercard</span>
            <span className="payment-mock">UPI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

