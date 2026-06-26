import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import BackButton from '../components/BackButton';
import '../styles/HomeScreen.css';

const ProductListingScreen = () => {
  const [products, setProducts] = useState([]);

  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');

  useEffect(() => {
    fetchProducts();
  }, [category]);

  async function fetchProducts() {
    let query = supabase
      .schema('marketplace_dataspace')
      .from('products')
      .select('*');

    // Filter only when category/seller is selected
    if (category) {
      query = query.eq('seller_id', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
      return;
    }

    setProducts(data);
  }

  return (
    <div className="section" style={{ paddingTop: '120px' }}>
      <div className="container">
        <BackButton />

        <h2 className="section-title">
          {category ? 'Community Products' : 'All Products'}
        </h2>

        <div className="products-grid">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductListingScreen;