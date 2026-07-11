import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, Heart, ShieldCheck,Share2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import BackButton from '../components/BackButton';
import MoonRating from '../components/MoonRating';
import '../styles/ProductDetail.css';
import { supabase } from '../supabase';
import { useWishlist } from '../context/wishlistContext';
import Skeleton from '../components/Skeleton';

const ProductDetailScreen = () => {
  
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct]= useState(null);
  const [reviews, setReviews]=useState([]);
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  useEffect(() => {
    fetchProduct();
    if (id) {
      recordProductView(id);
      fetchReviews();
    }
  }, [id]);

  async function fetchProduct(){
    const { data, error } = await supabase
      .schema('marketplace_dataspace')
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
  
      if (error){
        console.error(error);
        return;
      }

      // Fetch the seller's shop name 
      if (data.seller_id) {
        const { data: sellerData } = await supabase
          .schema('marketplace_dataspace')
          .from('sellers')
          .select('shop_name')
          .eq('id', data.seller_id)
          .single();
          
        if (sellerData) {
          data.shop_name = sellerData.shop_name;
        }
      }

      setProduct(data);
  }

  // record product view (user count)
  const recordProductView = async (productId) => {
    try {
      const { error } = await supabase.rpc('increment_view', { 
        row_id: productId 
      });

      if (error) {
        console.error("Error recording view:", error);
      }
    } catch (err) {
      console.error("Unexpected error recording view:", err);
    }
  };

  async function fetchReviews(){
    const {data, error}= await supabase
    .schema("marketplace_dataspace")
    .from("product_reviews")
    .select(`*,buyers(name)`)
    .eq("product_id",id)
    .order("created_at", { ascending: false });

    if(error){
      console.error(error);
      return;
    }
    setReviews(data);
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleShare = async () => {
    const productUrl = `${window.location.origin}/product/${product.id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `Check out this product: ${product.name}`,
          url: productUrl,
        });
      } else {
        await navigator.clipboard.writeText(productUrl);
        alert("Product link copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  if (!product) {
    return (
      <div className="section product-detail-page" style={{ paddingTop: '120px' }}>
        <div className="container">
          <BackButton />
          <div className="detail-grid">
            <div className="detail-images">
              <Skeleton type="image" height="500px" style={{ borderRadius: '15px' }} />
            </div>
            
            <div className="detail-info">
              <Skeleton type="text" width="30%" height="24px" style={{ marginBottom: '20px', borderRadius: '20px' }} />
              <Skeleton type="text" width="80%" height="40px" style={{ marginBottom: '15px' }} />
              <Skeleton type="text" width="40%" height="20px" style={{ marginBottom: '25px' }} />
              <Skeleton type="text" width="20%" height="30px" style={{ marginBottom: '30px' }} />
              
              <Skeleton type="text" width="100%" />
              <Skeleton type="text" width="100%" />
              <Skeleton type="text" width="90%" style={{ marginBottom: '30px' }} />
              
              <Skeleton type="image" width="100%" height="60px" style={{ marginBottom: '15px', borderRadius: '8px' }} />
              <Skeleton type="image" width="60px" height="60px" style={{ borderRadius: '8px' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }


  const handlePrevImage = () => {
    if (!product || !product.images) return;
    setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (!product || !product.images) return;
    setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="section product-detail-page" style={{ paddingTop: '120px' }}>
      <div className="container">
        <BackButton />
        <div className="detail-grid">
          <div className="detail-images">
            <div className="main-image-placeholder">
              <img src={product.images?.[currentImageIndex]} alt={product.name} />
                  <button className="share-btn" onClick={handleShare} aria-label="Share product">
                    <Share2 size={20} />
                  </button>
                {product.images?.length > 1 && (
                  <>
                  <button
                    style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', background: 'var(--bg-primary)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', fontSize: '18px', color: 'var(--text-primary)' }}
                    onClick={handlePrevImage}
                  >
                    ❮
                  </button>
                  <button 
                    onClick={handleNextImage}
                    style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', background: 'var(--bg-primary)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', fontSize: '18px', color: 'var(--text-primary)' }}
                  >
                    ❯
                  </button>
                </>
              )}
            </div>
            
            {product.images?.length > 1 && (
              <div className="image-thumbnails" style={{ display: 'flex', gap: '10px', marginTop: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
                {product.images.map((image, index) => (
                  <div 
                    key={index} 
                    onClick={() => setCurrentImageIndex(index)}
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      flexShrink: 0, 
                      cursor: 'pointer', 
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: currentImageIndex === index ? '2px solid var(--accent, #3498db)' : '2px solid transparent',
                      opacity: currentImageIndex === index ? 1 : 0.6,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <img src={image} alt={`${product.name} thumbnail ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="detail-info">
            <span className="brand-label">{product.shop_name || 'Marketplace Item'}</span>
            <h1>{product.name}</h1>
            <MoonRating rating={product.average_rating} count={product.rating_count} />
            <div className="price-tag">
              <span className="current-price">₹{product.price}</span>
              {product.oldPrice && <span className="old-price" style={{ marginLeft: '15px', textDecoration: 'line-through', color: 'var(--text-secondary)', fontSize: '1.5rem' }}>₹{product.oldPrice}</span>}
            </div>
            
            <p className="description">
              {product.description}
            </p>
                        
            <div className="action-btns">
              <button className="add-to-cart-big" onClick={handleAddToCart}>
                <ShoppingCart size={20} /> Add to Cart
              </button>
              <button className="wishlist-btn" onClick={()=>toggleWishlist(product.id)}><Heart fill={isWishlisted(product.id) ? "red" : "none"} color={isWishlisted(product.id) ? "red" : "currentColor"} /></button>
            </div>
            
            <div className="trust-badges">
              <div className="badge-item"><ShieldCheck size={20} /> <span>Secure Payment</span></div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section" style={{ marginTop: '80px', borderTop: '1px solid var(--border)', paddingTop: '60px' }}>
          <h2 style={{ marginBottom: '40px' }}>Customer Reviews</h2>
          <div className="reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {reviews.length===0 ? (<p>No reviews yet</p>):(reviews.map((review) => (
              <div key={review.id} className="review-card" style={{ padding: '30px', background: 'var(--bg-secondary)', borderRadius: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <h4 style={{ margin: 0 }}>{review.buyers.name}</h4>
                  <MoonRating rating={review.rating} />
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {review.comment}
                </p>
                <div style={{ marginTop: '15px', fontSize: '0.8rem', color: 'var(--accent)', fontWeight: '600' }}>Verified Purchase</div>
              </div>
            )))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailScreen;
