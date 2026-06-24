import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';
import '../styles/CheckoutScreen.css';

const CheckoutScreen = () => {
  return (
    <div className="section checkout-page" style={{ paddingTop: '120px' }}>
      <div className="container">
        <BackButton />
        <h1 className="section-title">Checkout</h1>
        
        <div className="checkout-layout">
          <div className="checkout-form">
            <div className="form-section">
              <h3>Shipping Information</h3>
              <div className="form-grid">
                <input type="text" placeholder="First Name" />
                <input type="text" placeholder="Last Name" />
                <input type="email" placeholder="Email Address" className="full-width" />
                <input type="text" placeholder="Address" className="full-width" />
                <input type="text" placeholder="City" />
                <input type="text" placeholder="Zip Code" />
              </div>
            </div>
            
            <div className="form-section">
              <h3>Payment Method</h3>
              <p className="lorem">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Placeholder for payment integration (Stripe/PayPal).</p>
              <div className="payment-options">
                <div className="option">Credit Card</div>
                <div className="option">PayPal</div>
              </div>
            </div>
            
            <Link to="/order-success" className="complete-order-btn" style={{ display: 'block', textAlign: 'center' }}>
              Complete Order
            </Link>
          </div>
          
          <div className="order-summary-side">
            <h3>Your Order</h3>
            <div className="mini-item">
              <div className="mini-img"></div>
              <div className="mini-info">
                <span>Lunar Glow Serum</span>
                <span>₹45.00</span>
              </div>
            </div>
            <div className="summary-details">
              <div className="row"><span>Subtotal</span> <span>₹45.00</span></div>
              <div className="row"><span>Shipping</span> <span>FREE</span></div>
              <div className="row total"><span>Total</span> <span>₹45.00</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutScreen;
