import React, { useState, useEffect } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import MoonRating from '../components/MoonRating';
import { supabase } from '../supabase';
import '../styles/ProductCard.css';

const ProductCard = ({ product, showRemoveButton, onRemove }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Track live stock count — start from what was fetched
  const initialStock =
    product.stock ?? product.stock_quantity ?? product.in_stock ?? null;
  const [stockCount, setStockCount] = useState(initialStock);

  // Real-time subscription: update stockCount whenever this product row changes
  useEffect(() => {
    const channel = supabase
      .channel(`product-stock-${product.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'marketplace_dataspace',
          table: 'products',
          filter: `id=eq.${product.id}`,
        },
        (payload) => {
          const updated = payload.new;
          const newStock =
            updated.stock ?? updated.stock_quantity ?? updated.in_stock ?? null;
          setStockCount(newStock);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [product.id]);

  const isOutOfStock =
    stockCount === 0 ||
    stockCount === false ||
    (typeof stockCount === 'number' && stockCount <= 0);

  const isLowStock =
    !isOutOfStock &&
    typeof stockCount === 'number' &&
    stockCount > 0 &&
    stockCount < 5;

  const handleBuyNow = (e) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addToCart(product);
    navigate('/checkout');
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addToCart(product);
  };

  return (
    <div className={`product-card${isOutOfStock ? ' out-of-stock-card' : ''}`} style={{ position: 'relative' }}>
      {showRemoveButton && (
        <button 
          className="remove-wishlist-btn" 
          onClick={(e) => { 
            e.preventDefault(); 
            e.stopPropagation();
            onRemove(product.id); 
          }}
          style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10, background: 'white', border: '1px solid #ddd', borderRadius: '50%', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <X size={16} color="red" />
        </button>
      )}
      <Link to={`/product/${product.id}`} className="product-image">
        <img src={product.images?.[0] || 'https://placehold.co/300x400'} alt={product.name} />
        {isOutOfStock
          ? <span className="badge badge-out-of-stock">Out of Stock</span>
          : product.discount && <span className="badge">-{product.discount}%</span>
        }
        {isLowStock && (
          <span className="badge badge-low-stock">Only {stockCount} left!</span>
        )}
        {!isOutOfStock && (
          <button className="add-to-cart-overlay" onClick={handleAddToCart}>
            <ShoppingCart size={18} /> Add to Cart
          </button>
        )}
      </Link>

      <div className="product-info">
        <Link to={`/product/${product.id}`}>
          <MoonRating rating={product.rating} count={128} />
          <h3 className="product-name">{product.name}</h3>
          <p className="product-category">{product.category}</p>
        </Link>
        <div className="product-price">
          <span className="current-price">₹{product.price}</span>
          {product.oldPrice && <span className="old-price">₹{product.oldPrice}</span>}
        </div>
        <button
          className="buy-now-btn"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          style={isOutOfStock ? { opacity: 0.45, cursor: 'not-allowed' } : {}}
        >
          {isOutOfStock ? 'Unavailable' : 'Buy Now'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
