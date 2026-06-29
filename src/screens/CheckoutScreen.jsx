import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Banknote, Loader, MapPin, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../supabase';
import BackButton from '../components/BackButton';
import '../styles/CheckoutScreen.css';

const CheckoutScreen = ({ user }) => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [fetchingAddresses, setFetchingAddresses] = useState(true);

  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    landmark: '',
    city: '',
    state: '',
    postal_code: '',
    notes: '',
    paymentMethod: 'Credit Card',
  });
  
  const [saveNewAddress, setSaveNewAddress] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Summary display values (across all items)
  const taxAmount = parseFloat((cartTotal * 0.05).toFixed(2));
  const totalAmount = parseFloat((cartTotal + taxAmount).toFixed(2));

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?.id) {
        setFetchingAddresses(false);
        return;
      }
      const { data, error } = await supabase
        .schema('marketplace_dataspace')
        .from('buyer_addresses')
        .select('*')
        .eq('buyer_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (!error && data) {
        setSavedAddresses(data);
        if (data.length > 0) {
          setSelectedAddressId(data[0].id);
        } else {
          setSelectedAddressId('new');
        }
      } else {
        setSelectedAddressId('new');
      }
      setFetchingAddresses(false);
    };

    fetchAddresses();
  }, [user]);

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

    if (!selectedAddressId) {
      setError('Please select or enter a shipping address.');
      return;
    }

    setLoading(true);
    
    let finalShippingAddress = '';
    let customerName = '';
    let customerPhone = '';
    
    if (selectedAddressId === 'new') {
      // Validate new address form
      if (!form.full_name || !form.phone || !form.address_line_1 || !form.city || !form.state || !form.postal_code) {
        setError('Please fill all required address fields.');
        setLoading(false);
        return;
      }
      
      finalShippingAddress = `${form.address_line_1}, ${form.address_line_2 ? form.address_line_2 + ', ' : ''}${form.landmark ? 'Near ' + form.landmark + ', ' : ''}${form.city}, ${form.state} - ${form.postal_code}`;
      customerName = form.full_name;
      customerPhone = form.phone;
      
      // Save to database if requested
      if (saveNewAddress && user?.id) {
        const { error: addressError } = await supabase
          .schema('marketplace_dataspace')
          .from('buyer_addresses')
          .insert({
            buyer_id: user.id,
            full_name: form.full_name,
            phone: form.phone,
            address_line_1: form.address_line_1,
            address_line_2: form.address_line_2 || null,
            landmark: form.landmark || null,
            city: form.city,
            state: form.state,
            postal_code: form.postal_code,
            is_default: savedAddresses.length === 0 // make default if it's the first one
          });
          
        if (addressError) {
          console.error("Failed to save address:", addressError);
          // Non-blocking error, we can still proceed with the order
        }
      }
    } else {
      const selected = savedAddresses.find(a => a.id === selectedAddressId);
      if (!selected) {
        setError('Selected address not found.');
        setLoading(false);
        return;
      }
      
      finalShippingAddress = `${selected.address_line_1}, ${selected.address_line_2 ? selected.address_line_2 + ', ' : ''}${selected.landmark ? 'Near ' + selected.landmark + ', ' : ''}${selected.city}, ${selected.state} - ${selected.postal_code}`;
      customerName = selected.full_name;
      customerPhone = selected.phone;
    }

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
        customer_name: customerName,
        customer_email: user?.email || '',
        customer_phone: customerPhone,
        shipping_address: finalShippingAddress,
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
              
              {/* Shipping Addresses List */}
              <div className="form-section">
                <h3>Shipping Address</h3>
                
                {fetchingAddresses ? (
                   <div style={{ display: 'flex', gap: '10px', alignItems: 'center', margin: '20px 0' }}>
                     <Loader size={18} className="spin" /> <span>Loading addresses...</span>
                   </div>
                ) : (
                  <div className="addresses-list">
                    {savedAddresses.map((addr) => (
                      <div 
                        key={addr.id} 
                        className={`address-card ${selectedAddressId === addr.id ? 'selected' : ''}`}
                        onClick={() => setSelectedAddressId(addr.id)}
                      >
                        <div className="address-header">
                          <MapPin size={18} />
                          <strong>{addr.address_type || 'Home'}</strong>
                          {addr.is_default && <span className="default-badge">Default</span>}
                        </div>
                        <div className="address-body">
                          <p><strong>{addr.full_name}</strong> • {addr.phone}</p>
                          <p>{addr.address_line_1}{addr.address_line_2 ? `, ${addr.address_line_2}` : ''}</p>
                          {addr.landmark && <p>Near {addr.landmark}</p>}
                          <p>{addr.city}, {addr.state} - {addr.postal_code}</p>
                        </div>
                      </div>
                    ))}
                    
                    <div 
                      className={`address-card new-address-card ${selectedAddressId === 'new' ? 'selected' : ''}`}
                      onClick={() => setSelectedAddressId('new')}
                    >
                      <Plus size={18} />
                      <strong>Add New Address</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* New Address Form (only visible if selected) */}
              {selectedAddressId === 'new' && !fetchingAddresses && (
                <div className="form-section new-address-form">
                  <h3>Enter New Address</h3>
                  <div className="form-grid">
                    <input
                      name="full_name"
                      type="text"
                      placeholder="Full Name *"
                      value={form.full_name}
                      onChange={handleChange}
                      required={selectedAddressId === 'new'}
                    />
                    <input
                      name="phone"
                      type="tel"
                      placeholder="Phone Number *"
                      value={form.phone}
                      onChange={handleChange}
                      required={selectedAddressId === 'new'}
                    />
                    <input
                      name="address_line_1"
                      type="text"
                      placeholder="Address Line 1 *"
                      className="full-width"
                      value={form.address_line_1}
                      onChange={handleChange}
                      required={selectedAddressId === 'new'}
                    />
                    <input
                      name="address_line_2"
                      type="text"
                      placeholder="Address Line 2 (Optional)"
                      className="full-width"
                      value={form.address_line_2}
                      onChange={handleChange}
                    />
                    <input
                      name="landmark"
                      type="text"
                      placeholder="Landmark (Optional)"
                      className="full-width"
                      value={form.landmark}
                      onChange={handleChange}
                    />
                    <input
                      name="city"
                      type="text"
                      placeholder="City *"
                      value={form.city}
                      onChange={handleChange}
                      required={selectedAddressId === 'new'}
                    />
                    <input
                      name="state"
                      type="text"
                      placeholder="State *"
                      value={form.state}
                      onChange={handleChange}
                      required={selectedAddressId === 'new'}
                    />
                    <input
                      name="postal_code"
                      type="text"
                      placeholder="PIN / Zip Code *"
                      value={form.postal_code}
                      onChange={handleChange}
                      required={selectedAddressId === 'new'}
                    />
                    
                    {user?.id && (
                      <div className="save-address-checkbox full-width">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '10px' }}>
                          <input 
                            type="checkbox" 
                            checked={saveNewAddress} 
                            onChange={(e) => setSaveNewAddress(e.target.checked)}
                            style={{ width: 'auto', cursor: 'pointer' }}
                          />
                          Save this address for future use
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Order Notes */}
              <div className="form-section">
                <h3>Order Notes</h3>
                <textarea
                  name="notes"
                  placeholder="Order notes (optional)"
                  className="full-width"
                  rows={3}
                  value={form.notes}
                  onChange={handleChange}
                  style={{ width: '100%', resize: 'vertical', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontFamily: 'inherit' }}
                />
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
