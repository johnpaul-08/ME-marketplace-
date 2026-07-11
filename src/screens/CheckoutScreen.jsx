import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Banknote, Loader, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useNotifications } from '../context/NotificationContext';
import { supabase } from '../supabase';
import BackButton from '../components/BackButton';
import '../styles/CheckoutScreen.css';
import AddressDrawer from "../components/checkout/AddressDrawer";


const CheckoutScreen = ({ user }) => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { addNotification } = useNotifications();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [fetchingAddresses, setFetchingAddresses] = useState(true);

  const [form, setForm] = useState({
    paymentMethod: 'Credit Card',
  });

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
        .schema("marketplace_dataspace")
        .from("buyer_addresses")
        .select("*")
        .eq("buyer_id", user.id)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });

      if (!error && data) {
        setSavedAddresses(data);
      }

      setFetchingAddresses(false);
    };

    fetchAddresses();
  }, [user]);

      useEffect(() => {
      if (savedAddresses.length > 0) {
        const defaultAddr =
          savedAddresses.find(addr => addr.is_default) || savedAddresses[0];

        setSelectedAddress(defaultAddr);
      }
    }, [savedAddresses]);

const handleAddAddress = async (address) => {
  // Reset previous default address if needed
  if (address.is_default) {
    const { error: resetError } = await supabase
      .schema("marketplace_dataspace")
      .from("buyer_addresses")
      .update({ is_default: false })
      .eq("buyer_id", user.id);

    if (resetError) {
      console.error(resetError);
      return;
    }
  }

  // Insert new address and return it
  const { data, error } = await supabase
    .schema("marketplace_dataspace")
    .from("buyer_addresses")
    .insert({
      ...address,
      buyer_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    return;
  }

  // Update Checkout state
  setSavedAddresses(prev => [data, ...prev]);

  // Automatically select the new address
  setSelectedAddress(data);

  // Close drawer
  setDrawerOpen(false);
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

          const selected = selectedAddress;

      if (!selected) {
        setError("Please add a shipping address.");
        return;
      }

      setLoading(true);

      let finalShippingAddress = '';
      let customerName = '';
      let customerPhone = '';

      finalShippingAddress = `${selected.address_line_1}${
        selected.address_line_2 ? `, ${selected.address_line_2}` : ''
      }${
        selected.landmark ? `, Near ${selected.landmark}` : ''
      }, ${selected.city}, ${selected.state} - ${selected.postal_code}`;

      customerName = selected.name;
      customerPhone = selected.phone;

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
    (sum, i) => sum + i.price * i.quantity,
    0
  );




  const groupTax = parseFloat((groupSubtotal * 0.05).toFixed(2));
  const groupTotal = parseFloat((groupSubtotal + groupTax).toFixed(2));

  return {
    seller_id: sid === 'no_seller' ? null : sid,
    customer_name: customerName,
    customer_email: user?.email || '',
    customer_phone: customerPhone,
    shipping_address: finalShippingAddress,

    items: groupItems.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      seller_id: item.seller_id || null,
      image_url: item.images?.[0] || item.image || item.image_url || null,
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

    // ── Fire order notifications (optimistic — updates badge instantly) ──
    const method = form.paymentMethod || 'Online';
    const uid = user?.id;

    // Order booked
    showToast({
      title: 'Order Booked!',
      message: `Your order has been placed successfully. We'll notify you of updates.`,
      type: 'order',
      duration: 5000,
    });
    addNotification({
      type:    'order',
      color:   '#ff7612',
      title:   'Order Booked!',
      message: `Your order has been placed successfully. We'll notify you of updates.`,
    }, uid);

    // Payment received
    showToast({
      title: 'Payment Received',
      message: `₹${totalAmount.toFixed(2)} paid via ${method}.`,
      type: 'success',
      duration: 5000,
    });
    addNotification({
      type:    'payment',
      color:   '#2ed573',
      title:   'Payment Received',
      message: `₹${totalAmount.toFixed(2)} paid via ${method}.`,
    }, uid);

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
                  <div className='loading-row'>
                    <Loader size={18} className="spin" /> <span>Loading addresses...</span>
                  </div>
                ) : (
                    <div className="addresses-list">
                      {selectedAddress ? (
                        <div className="address-card">
                          <div className="address-header">
                              <div className="address-header-left">
                                <MapPin size={18} />
                                  {selectedAddress.is_default && (
                                    <span className="default-badge">
                                      Default
                                    </span>
                                  )}
                              </div>

                                  <button
                                    type="button"
                                    className="change-address-btn"
                                    onClick={() => setDrawerOpen(true)}
                                  >
                                    Change
                                  </button>
                            </div>

                              <div className="address-body">
                                <p>
                                  <strong>{selectedAddress.name}</strong> • {selectedAddress.phone}
                                </p>

                                <p>
                                  {selectedAddress.address_line_1}
                                  {selectedAddress.address_line_2 &&
                                    `, ${selectedAddress.address_line_2}`}
                                </p>

                                {selectedAddress.landmark && (
                                  <p>Near {selectedAddress.landmark}</p>
                                )}

                                <p>
                                  {selectedAddress.city}, {selectedAddress.state} -{" "}
                                  {selectedAddress.postal_code}
                                </p>
                              </div>
                        </div>
                      ) : (
                      <div className="no-address">
                          <p>No saved address.</p>
                          <p>Add a shipping address from your Account before placing an order.</p>
                      </div>
                      )}
                    </div>
                )}
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
                    {(item.images?.[0] || item.image || item.image_url) && (
                      <img
                        src={item.images?.[0] || item.image || item.image_url}
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
        <AddressDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          addresses={savedAddresses}
          selectedAddress={selectedAddress}
          onSelect={(address) => {
            setSelectedAddress(address);
            setDrawerOpen(false);
          }}
          onAddAddress={handleAddAddress}
        />
    </div>
  );
};

export default CheckoutScreen;
