import React, {useState, useEffect} from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import BackButton from '../components/BackButton';
import { supabase } from '../supabase';


const SearchResultsScreen = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] =useState([]);


  useEffect(()=>{
    fetchProducts();
  }, [query])

  async function fetchProducts(){
    const{data, error}= await supabase
      .schema('marketplace_dataspace')
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,category.ilike.%${query}%`);
    if(error){
      console.error(error);
      return;
    }

    setProducts(data);
  }

  return (
    <div className="section" style={{ paddingTop: '120px' }}>
      <div className="container">
        <BackButton />
        <h1 className="section-title">Search Results for "{query}"</h1>
        <p style={{ marginBottom: '40px', color: 'var(--text-secondary)' }}>Showing {products.length} products found</p>
        
        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsScreen;
