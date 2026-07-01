import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, Bell } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
import Logo from './Logo';
import '../styles/Header.css';

const Header = ({ isLoggedIn = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount } = useCart();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-content">
        <div className="menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </div>

        <Link to="/"><Logo className="header-logo" /></Link>

        <nav className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/">Home</Link>
          <Link to="/categories">Community</Link>
          <Link to="/best-sellers">Best Sellers</Link>
          <Link to="/track-order">Track Order</Link>
        </nav>

        <div className="header-actions">
          <form className="search-bar" onSubmit={handleSearch}>
            <Search size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {isLoggedIn ? (
            <>
              <Link to="/account" className="icon-btn profile-btn"><User size={22} /></Link>
              <Link to="/account?tab=notifications" className="icon-btn header-notif-btn" title="Notifications" id="header-notifications-btn">
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="header-notif-count">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
              </Link>
            </>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="login-link">Login</Link>
              <span className="divider">/</span>
              <Link to="/signup" className="signup-link">Sign Up</Link>
            </div>
          )}

          <Link to="/cart" className="icon-btn cart-btn">
            <ShoppingBag size={22} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
