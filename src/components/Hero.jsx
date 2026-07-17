import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../supabase';
import Skeleton from './Skeleton';
import '../styles/Hero.css';

const Hero = () => {
  const [collageImages, setCollageImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRandomProductImage();
  }, []);

  const fetchRandomProductImage = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .schema('marketplace_dataspace')
        .from('products')
        .select('images')
        .not('images', 'is', null)
        .limit(30);

      if (error) {
        console.error("Error fetching products for hero:", error);
        return;
      }

      if (data && data.length > 0) {
        let allImages = [];
        data.forEach(product => {
          if (product.images && Array.isArray(product.images)) {
             allImages = [...allImages, ...product.images];
          }
        });

        // Filter out empty or broken strings just in case
        allImages = allImages.filter(img => typeof img === 'string' && img.trim() !== '');

        if (allImages.length >= 3) {
           // Shuffle and pick 3
           const shuffled = allImages.sort(() => 0.5 - Math.random());
           const selectedImages = shuffled.slice(0, 3);
           setCollageImages(selectedImages);
        } else {
           setCollageImages(allImages);
        }
      }
    } catch (err) {
      console.error("Failed to fetch product images", err);
    } finally {
      setLoading(false);
    }
  };

  const showSkeleton = loading || collageImages.length < 3;

  return (
    <section className="hero-modern">
      <div className="hero-modern-container">
        
        {/* Left Side: Massive Typography */}
        <motion.div 
          className="hero-modern-text"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="hero-modern-eyebrow">A Movement For The Youth</p>
          <h1 className="hero-modern-title">
            Empower<br/>
            <span className="accent-italic">young minds.</span>
          </h1>
          <p className="hero-modern-subtitle">
            Every purchase fuels our mission to provide free mental health resources and youth support across India.
          </p>
          
          <div className="hero-modern-actions">
             <Link to="/shop" className="btn-organic">Shop Collection</Link>
             <Link to="/about" className="link-organic">Discover our Impact ↗</Link>
          </div>
        </motion.div>

        {/* Right Side: Editorial Collage */}
        <div className="hero-editorial-visual">
          <motion.div 
            className="editorial-img-main"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
          >
            {showSkeleton ? (
              <Skeleton type="image" height="100%" style={{ borderRadius: '20px' }} />
            ) : (
              <img src={collageImages[0]} alt="Youth Empowerment Product" />
            )}
          </motion.div>
          
          <motion.div 
            className="editorial-img-accent-1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          >
            {showSkeleton ? (
              <Skeleton type="image" height="100%" style={{ borderRadius: '20px' }} />
            ) : (
              <img src={collageImages[1]} alt="Product Highlight" />
            )}
          </motion.div>

          <motion.div 
            className="editorial-img-accent-2"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
          >
            {showSkeleton ? (
              <Skeleton type="image" height="100%" style={{ borderRadius: '20px' }} />
            ) : (
              <img src={collageImages[2]} alt="Creative Product" />
            )}
           
          </motion.div>
        </div>
        
      </div>
    </section>
  );
};

export default Hero;

