import React from 'react';
import '../styles/HomeScreen.css';

const AboutScreen = () => {
  return (
    <div className="section" style={{ paddingTop: '120px' }}>
      <div className="container">
        <div className="about-hero" style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 style={{ fontSize: '4rem', marginBottom: '20px' }}>Our Story</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto' }}>
            Mind Empowerment (ME) is a non-profit dedicated to youth empowerment and mental health awareness in India — and the ME Marketplace is how we sustain that mission.
          </p>
        </div>
        
        <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div className="about-img" style={{ height: '500px', background: 'var(--bg-secondary)', borderRadius: '20px' }}>
             <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80" alt="Youth Empowerment" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px' }} />
          </div>
          <div className="about-text">
            <h2>Shop with Purpose</h2>
            <p style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>
              Every product in the ME Marketplace is curated or created by our partner communities — from handcrafted goods to wellness essentials. When you shop here, a portion of every sale goes directly toward funding free webinars, workshops, and mental health support for Gen-Z youth across India.
            </p>
            <p style={{ color: 'var(--text-secondary)' }}>
              Founded by Maya Menon and Sreela Menon, Mind Empowerment has been illuminating minds and transforming lives since 2020. The ME Marketplace is our way of making that mission sustainable — one mindful purchase at a time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutScreen;

