import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import ProductCard from '../components/ProductCard';
import BackButton from '../components/BackButton';
import { Trophy } from 'lucide-react';
import Skeleton from '../components/Skeleton';

const BestSellersScreen = () => {

    const [products, setProducts]= useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(()=>{fetchProducts();},[]);
  
    async function fetchProducts(){
      setLoading(true);
      const {data, error} = await supabase
      .schema('marketplace_dataspace')
      .from('products')
      .select('*');
  
      if (error){
        console.error(error);
        setLoading(false);
        return;
      }
      setProducts(data);
      setLoading(false);
    }
    
  return (
    <div className="section" style={{ paddingTop: '120px' }}>
      <div className="container">
        <BackButton />
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <Trophy size={48} color="var(--accent)" style={{ marginBottom: '20px' }} />
          <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>Best Sellers</h1>
          <p style={{ color: 'var(--text-secondary)' }}>The products our community can't get enough of.</p>
        </div>
        
        <div className="products-grid">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={`skel-${idx}`} style={{ padding: '15px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                <Skeleton type="image" height="250px" style={{ marginBottom: '15px' }} />
                <Skeleton type="text" width="60%" style={{ marginBottom: '10px' }} />
                <Skeleton type="text" width="80%" style={{ marginBottom: '15px' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Skeleton type="text" width="30%" />
                  <Skeleton type="circular" width="40px" height="40px" />
                </div>
              </div>
            ))
          ) : (
            products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BestSellersScreen;
