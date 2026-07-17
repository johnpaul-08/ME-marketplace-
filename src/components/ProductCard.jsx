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
    <div className={`product-card${isOutOfStock ? ' out-of-stock-card' : ''}`}>
      {showRemoveButton && (
        <button 
          className="remove-wishlist-btn" 
          onClick={(e) => { 
            e.preventDefault(); 
            e.stopPropagation();
            onRemove(product.id); 
          }}
          style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10, background: 'white', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
        >
          <X size={16} color="var(--me-maroon)" />
        </button>
      )}

      <Link to={`/product/${product.id}`} className="product-image">
        <img src={product.images?.[0] || 'https://placehold.co/300x400'} alt={product.name} />
        
        {isOutOfStock
          ? <span className="badge badge-out-of-stock">Sold Out</span>
          : product.discount && <span className="badge">-{product.discount}%</span>
        }
        
        {isLowStock && (
          <span className="badge badge-low-stock">Only {stockCount} left!</span>
        )}
        
        {/* Sleek floating add to cart button */}
        {!isOutOfStock && (
          <button className="add-to-cart-action" onClick={handleAddToCart} title="Add to Cart">
            <ShoppingCart size={20} />
          </button>
        )}
      </Link>

      <div className="product-info">
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <p className="product-category">{product.category}</p>
          <h3 className="product-name">{product.name}</h3>
          <div className="rating-container">
            <MoonRating rating={product.average_rating} count={product.rating_count} />
          </div>
        </Link>
        <div className="product-price">
          <span className="current-price">₹{product.price}</span>
          {product.oldPrice && <span className="old-price">₹{product.oldPrice}</span>}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
