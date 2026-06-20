import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/HomeScreen.css';

const OrderSuccessScreen = () => {
  return (
    <div className="section" style={{ paddingTop: '150px', textAlign: 'center' }}>
      <div className="container">
        <CheckCircle size={80} color="#2ed573" style={{ marginBottom: '30px' }} />
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Order Confirmed!</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
          Thank you for shopping with ME Marketplace. Your order #ME-9482 has been placed successfully. We'll email you a confirmation with tracking details shortly.
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <Link to="/shop" className="primary-btn" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            Continue Shopping <ArrowRight size={18} />
          </Link>
          <Link to="/account" className="secondary-btn">Track Order</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessScreen;
