import React,{ useState, useEffect } from 'react';
import { User, Package, MapPin, Settings, LogOut } from 'lucide-react';
import BackButton from '../components/BackButton';
import '../styles/Account.css';
import { supabase } from '../supabase';

const AccountScreen = ({ onLogout }) => {

  const [user, setUser]=useState(null);

  useEffect(()=>{
    const getUser=async ()=>{
      const{
        data :{user}
      }=await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  return (
    <div className="section account-page" style={{ paddingTop: '120px' }}>
      <div className="container">
        <BackButton />
        <div className="account-layout">
          <aside className="account-sidebar">
            <div className="user-profile-header">
              <div className="avatar-placeholder">{user?.user_metadata?.full_name?.charAt(0).toUpperCase() || 'U'}</div>
              <div>
                <h3>{user?.user_metadata?.full_name||'user'}</h3>
                <p>{user?.email}</p>
              </div>
            </div>
            
            <nav className="account-nav">
              <button className="active"><Package size={18} /> My Orders</button>
              <button><MapPin size={18} /> Addresses</button>
              <button><Settings size={18} /> Settings</button>
              <button className="logout-btn" onClick={onLogout}><LogOut size={18} /> Logout</button>
            </nav>
          </aside>
          
          <main className="account-content">
            <h2>My Orders</h2>
            <div className="orders-list">
              <div className="order-item">
                <div className="order-header">
                  <span>Order #LL-9482</span>
                  <span className="status delivered">Delivered</span>
                </div>
                <div className="order-body">
                  <div className="order-img"></div>
                  <div className="order-info">
                    <h4>Lunar Glow Serum</h4>
                    <p>Quantity: 1</p>
                    <p className="price">$45.00</p>
                  </div>
                  <button className="track-btn">Track Order</button>
                </div>
              </div>
              
              <p className="lorem">Your order history will appear here.</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AccountScreen;
