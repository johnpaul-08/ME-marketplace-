import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import '../styles/Auth.css'; // Reusing form styles

const ContactScreen = () => {
  return (
    <div className="section" style={{ paddingTop: '120px' }}>
      <div className="container">
        <h1 className="section-title">Get in Touch</h1>
        
        <div className="contact-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '60px' }}>
          <div className="contact-info-side">
            <p style={{ marginBottom: '40px', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
              Have questions about an order or want to know more about Mind Empowerment's mission? Our team is here to help.
            </p>
            
            <div className="contact-details" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div style={{ display: 'flex', gap: '20px' }}>
                <Mail color="var(--accent)" />
                <div>
                  <h4 style={{ marginBottom: '5px' }}>Email Us</h4>
                  <p>hello@mind-empowered.org</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '20px' }}>
                <Phone color="var(--accent)" />
                <div>
                  <h4 style={{ marginBottom: '5px' }}>Call Us</h4>
                  <p>+91 98765 43210</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '20px' }}>
                <MapPin color="var(--accent)" />
                <div>
                  <h4 style={{ marginBottom: '5px' }}>Visit Us</h4>
                  <p>India</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="contact-form-side">
            <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <input type="text" placeholder="Name" style={{ padding: '15px', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <input type="email" placeholder="Email" style={{ padding: '15px', border: '1px solid var(--border)', borderRadius: '8px' }} />
              </div>
              <input type="text" placeholder="Subject" style={{ padding: '15px', border: '1px solid var(--border)', borderRadius: '8px' }} />
              <textarea placeholder="Message" rows="6" style={{ padding: '15px', border: '1px solid var(--border)', borderRadius: '8px', fontFamily: 'inherit' }}></textarea>
              <button className="auth-btn" style={{ width: 'fit-content', padding: '15px 50px' }}>
                Send Message <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactScreen;
