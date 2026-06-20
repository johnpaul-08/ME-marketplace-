import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container hero-content">
        <motion.div 
          className="hero-text"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="hero-title">Shop & <span className="accent-text">Empower</span> Young Minds</h1>
          <p className="hero-subtitle">Every purchase directly supports Mind Empowerment's mission — free mental health resources, workshops, and youth support across India.</p>
          <div className="hero-btns">
            <Link to="/shop" className="primary-btn">Shop Now</Link>
            <Link to="/about" className="secondary-btn">Learn More</Link>
          </div>
        </motion.div>
        
        <motion.div 
          className="hero-image-container"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="placeholder-image">
            <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Youth Empowerment" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
