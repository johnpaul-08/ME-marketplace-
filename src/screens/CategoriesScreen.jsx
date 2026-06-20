import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';
import '../styles/HomeScreen.css';

const CATEGORIES = [
  {
    id: 'mind-empowered',
    name: 'Mind Empowered',
    description: 'Youth empowerment & mental health awareness',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'smrithi',
    name: 'Smrithi',
    description: 'Honouring memory through community & care',
    image: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'kairali-foundation',
    name: 'Kairali Foundation',
    description: 'Empowering lives through education & culture',
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'fr-agostino',
    name: 'Fr. Agostino Vicini Special School',
    description: 'Supporting children with special needs',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80'
  },
];

const CategoriesScreen = () => {
  return (
    <div className="section" style={{ paddingTop: '120px' }}>
      <div className="container">
        <BackButton />
        <h1 className="section-title">Our Communities</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '50px', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 50px' }}>
          Every purchase supports one of our partner communities. Choose a community to shop their collection.
        </p>
        <div className="category-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          {CATEGORIES.map(cat => (
            <Link to={`/shop?category=${cat.id}`} key={cat.id} className="category-card" style={{ position: 'relative', height: '350px', borderRadius: '15px', overflow: 'hidden', display: 'block' }}>
              <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '30px', background: 'linear-gradient(transparent, rgba(70, 23, 17, 0.92))', color: 'white' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '6px' }}>{cat.name}</h3>
                <span style={{ fontSize: '0.85rem', opacity: 0.85 }}>{cat.description}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesScreen;

