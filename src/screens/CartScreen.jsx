import React, {useEffect} from 'react';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import BackButton from '../components/BackButton';
import { supabase } from '../supabase';
import '../styles/CartScreen.css';

const CartScreen = () => {
  const {
    cartItems,
    setCartItems,
    updateQuantity,
    removeFromCart,
    cartTotal
  } = useCart();

  const fetchCart = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .schema('marketplace_dataspace')
        .from('cart_items')
        .select(`
          quantity,
          products (*)
        `)
        .eq('buyer_id', user.id);

      if (error) {
        console.error(error);
        return;
      }

      const formattedCart = data.map(item => ({
        ...item.products,
        quantity: item.quantity
      }));

      setCartItems(formattedCart);
  };
  useEffect(() => {
    fetchCart();
  }, []);

  if (cartItems.length === 0) {
    return (
      <div className="section cart-page" style={{ paddingTop: '150px', textAlign: 'center' }}>
        <div className="container">
          <BackButton />
          <ShoppingBag size={60} style={{ marginBottom: '20px', color: 'var(--text-secondary)' }} />
          <h2>Your cart is empty</h2>
          <p style={{ margin: '20px 0 40px' }}>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/shop" className="primary-btn">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section cart-page" style={{ paddingTop: '120px' }}>
      <div className="container">
        <BackButton />
        <h1 className="section-title">Your Cart ({cartItems.length} items)</h1>
        
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="item-img-placeholder">
                  <img src={item.images?.[0] || 'https://placehold.co/100x100'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>{item.category}</p>
                  <div className="item-price">₹{item.price}</div>
                </div>
                <div className="item-quantity">
                  <button onClick={() => updateQuantity(item.id, -1)}><Minus size={16} /></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}><Plus size={16} /></button>
                </div>
                <div className="item-total">₹{(item.price * item.quantity).toFixed(2)}</div>
                <button className="remove-btn" onClick={() => removeFromCart(item.id)}><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>FREE</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="checkout-btn" style={{ display: 'block', textAlign: 'center' }}>
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;
