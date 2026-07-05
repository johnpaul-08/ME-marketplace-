import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { supabase } from '../supabase';
import '../styles/HomeScreen.css';

const CategoriesScreen = () => {

  const [communities, setCommunities]= useState([]);

  useEffect(()=>{
    fetchCommunities();
  }, []);

  async function fetchCommunities(){
    const { data, error } = await supabase
    .schema('marketplace_dataspace')
    .from('sellers')
    .select('*');

    if(error){
      console.error(error);
      return;
    }

    // Filter out any seller that is an admin
    const nonAdminCommunities = data.filter(community => community.is_admin !== true);
    setCommunities(nonAdminCommunities);
  }

  return (
    <div className="section" style={{ paddingTop: '120px' }}>
      <div className="container">
        <BackButton />
        <h1 className="section-title">Our Communities</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '50px', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 50px' }}>
          Every purchase supports one of our partner communities. Choose a community to shop their collection.
        </p>
        <div className="category-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 350px))', justifyContent: 'center', gap: '30px' }}>
          {communities.map(cat => (
            <Link to={`/shop?category=${cat.id}`} key={cat.id} className="category-card" style={{ position: 'relative', height: '350px', borderRadius: '15px', overflow: 'hidden', display: 'block' }}>
              <img src={cat.logo || 'https://placehold.co/400x400'} alt={cat.shop_name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '30px', background: 'linear-gradient(transparent, rgba(70, 23, 17, 0.92))', color: 'white' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '6px' }}>{cat.shop_name}</h3>
                <span style={{ fontSize: '0.85rem', opacity: 0.85 }}>{cat.about}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesScreen;

