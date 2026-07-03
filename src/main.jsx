import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/NotificationSettings.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { WishlistProvider } from './context/wishlistContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ToastProvider>
            <NotificationProvider>
              <App />
            </NotificationProvider>
          </ToastProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
