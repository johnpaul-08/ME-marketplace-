import React from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';
import '../styles/HomeScreen.css';

const MOCK_PRODUCTS = [
  { id: 1, name: "Mindful Journal", category: "Wellness", price: 450, oldPrice: 600, rating: 5, discount: 25 },
  { id: 2, name: "Empowerment Tote Bag", category: "Accessories", price: 320, rating: 4 },
  { id: 3, name: "Self-Care Kit", category: "Wellness", price: 280, oldPrice: 350, rating: 5, discount: 20 },
  { id: 4, name: "Mental Health Planner", category: "Stationery", price: 550, rating: 4 },
  { id: 5, name: "Resilience Bracelet", category: "Accessories", price: 380, rating: 5 },
  { id: 6, name: "Calm & Focus Tea", category: "Wellness", price: 220, rating: 4 },
  { id: 7, name: "ME Community Hoodie", category: "Apparel", price: 1200, rating: 5 },
  { id: 8, name: "Affirmation Cards Set", category: "Stationery", price: 250, rating: 4 },
];

const HomeScreen = () => {
  return (
    <div className="home-screen">
      <Hero />
      
      <section className="section categories">
        <div className="container">
          <h2 className="section-title">Shop by Community</h2>
          <div className="category-grid">
            {['Mind Empowered', 'Smrithi', 'Kairali Foundation', 'Fr. Agostino Vicini Special School'].map((cat, i) => (
              <motion.div 
                key={cat} 
                className="category-item"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="cat-placeholder"></div>
                <span>{cat}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section featured-products">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">New Arrivals</h2>
            <a href="/shop" className="view-all">View All</a>
          </div>
          
          <div className="products-grid">
            {MOCK_PRODUCTS.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section promo-banner">
        <div className="container">
          <div className="banner-content">
            <h3>Join the ME Community</h3>
            <p>Subscribe to get updates on new products, exclusive launches, and how your purchases are making an impact.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button>Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;

