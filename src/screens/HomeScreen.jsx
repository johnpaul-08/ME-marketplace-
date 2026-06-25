import React from 'react';
import { useState,useEffect } from 'react';
import Hero from '../components/Hero';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';
import { supabase } from '../supabase';
import '../styles/HomeScreen.css';

const HomeScreen = () => {

  const [products, setProducts]= useState([]);

  useEffect(()=>{fetchProducts();},[]);

  async function fetchProducts(){
    const {data, error} = await supabase
    .schema('marketplace_dataspace')
    .from('products')
    .select('*');

    if (error){
      console.error(error);
      return;
    }
    setProducts(data);
  }



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
            <Link to="/shop" className="view-all">View All</Link>
          </div>
          
          <div className="products-grid">
            {products
              .filter(p => p.stock !== 0 && p.stock_quantity !== 0 && p.in_stock !== false)
              .map((product, i) => (
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

