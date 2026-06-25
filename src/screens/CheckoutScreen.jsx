import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Banknote, Loader } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../supabase';
import BackButton from '../components/BackButton';
import '../styles/CheckoutScreen.css';

const CheckoutScreen = ({ user }) => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    notes: '',
    paymentMethod: 'Credit Card',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Summary display values (across all items)
  const taxAmount = parseFloat((cartTotal * 0.05).toFixed(2));
  const totalAmount = parseFloat((cartTotal + taxAmount).toFixed(2));

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setLoading(true);

    // Group cart items by seller_id — one order per seller
    const sellerGroups = {};
    cartItems.forEach((item) => {
      const sid = item.seller_id || 'no_seller';
      if (!sellerGroups[sid]) sellerGroups[sid] = [];
      sellerGroups[sid].push(item);
    });

    // Build one order payload per seller group
    const orderPayloads = Object.entries(sellerGroups).map(([sid, groupItems]) => {
      const groupSubtotal = groupItems.reduce(
        (sum, i) => sum + i.price * i.quantity, 0
      );
      const groupTax = parseFloat((groupSubtotal * 0.05).toFixed(2));
      const groupTotal = parseFloat((groupSubtotal + groupTax).toFixed(2));

      return {
        seller_id: sid === 'no_seller' ? null : sid,
        customer_name: `${form.firstName} ${form.lastName}`.trim(),
        customer_email: form.email,
        customer_phone: form.phone,
        shipping_address: `${form.address}, ${form.city} - ${form.zip}`,
        customer_notes: form.notes || null,
        items: groupItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          seller_id: item.seller_id || null,
          image_url: item.image || item.image_url || null,
        })),
        subtotal_amount: parseFloat(groupSubtotal.toFixed(2)),
        shipping_fee: 0,
        tax_amount: groupTax,
        discount_amount: 0,
        total_amount: groupTotal,
        payment_method: form.paymentMethod,
        payment_status: 'pending',
        fulfillment_status: 'Processing',
      };
    });

    const { error: insertError } = await supabase
      .schema('marketplace_dataspace')
      .from('orders')
      .insert(orderPayloads);

    setLoading(false);

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      setError(`Failed to place order: ${insertError.message}`);
      return;
    }

    clearCart();
    navigate('/order-success');
  };

  const paymentOptions = [
    { label: 'Credit Card', icon: <CreditCard size={18} /> },
    { label: 'UPI', icon: <Smartphone size={18} /> },
    { label: 'Cash on Delivery', icon: <Banknote size={18} /> },
  ];

  return (
    <div className="section checkout-page" style={{ paddingTop: '120px' }}>
      <div className="container">
        <BackButton />
        <h1 className="section-title">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="checkout-layout">
            {/* Left — Form */}
            <div className="checkout-form">

              {/* Shipping */}
              <div className="form-section">
                <h3>Shipping Information</h3>
                <div className="form-grid">
                  <input
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                  />
                  <input
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    className="full-width"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Phone Number"
                    className="full-width"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                  <input
                    name="address"
                    type="text"
                    placeholder="Street Address"
                    className="full-width"
                    value={form.address}
                    onChange={handleChange}
                    required
                  />
                  <input
                    name="city"
                    type="text"
                    placeholder="City"
                    value={form.city}
                    onChange={handleChange}
                    required
                  />
                  <input
                    name="zip"
                    type="text"
                    placeholder="PIN / Zip Code"
                    value={form.zip}
                    onChange={handleChange}
                    required
                  />
                  <textarea
                    name="notes"
                    placeholder="Order notes (optional)"
                    className="full-width"
                    rows={3}
                    value={form.notes}
                    onChange={handleChange}
                    style={{ resize: 'vertical', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontFamily: 'inherit' }}
                  />
                </div>
              </div>

              {/* Payment */}
              <div className="form-section">
                <h3>Payment Method</h3>
                <div className="payment-options">
                  {paymentOptions.map((opt) => (
                    <div
                      key={opt.label}
                      className={`option ${form.paymentMethod === opt.label ? 'selected' : ''}`}
                      onClick={() => setForm((prev) => ({ ...prev, paymentMethod: opt.label }))}
                    >
                      {opt.icon} {opt.label}
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <p style={{ color: '#ff4757', marginBottom: '12px', fontWeight: 600 }}>{error}</p>
              )}

              <button
                type="submit"
                className="complete-order-btn"
                disabled={loading || cartItems.length === 0}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? <><Loader size={18} className="spin" /> Placing Order…</> : 'Complete Order'}
              </button>
            </div>

            {/* Right — Order Summary */}
            <div className="order-summary-side">
              <h3>Your Order</h3>

              {cartItems.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>Your cart is empty.</p>
              ) : (
                cartItems.map((item) => (
                  <div className="mini-item" key={item.id}>
                    {(item.image || item.image_url) && (
                      <img
                        src={item.image || item.image_url}
                        alt={item.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
                      />
                    )}
                    <div className="mini-info">
                      <span>{item.name}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>× {item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))
              )}

              <div className="summary-details">
                <div className="row"><span>Subtotal</span> <span>₹{cartTotal.toFixed(2)}</span></div>
                <div className="row"><span>Shipping</span> <span>FREE</span></div>
                <div className="row"><span>Tax (5%)</span> <span>₹{taxAmount.toFixed(2)}</span></div>
                <div className="row total"><span>Total</span> <span>₹{totalAmount.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutScreen;
