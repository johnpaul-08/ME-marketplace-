import React, { createContext, useContext, useState, useCallback } from 'react';

/* ----------------------------------------------------------------
   Sample seed notifications — shown on first load
---------------------------------------------------------------- */
const SEED_NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'order',
    color: '#ff7612',
    emoji: '🎉',
    title: 'Order Booked!',
    message: 'Your order #MKT2891 has been successfully placed.',
    time: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    read: false,
  },
  {
    id: 'n2',
    type: 'payment',
    color: '#2ed573',
    emoji: '✅',
    title: 'Payment Received',
    message: '₹1,299 paid via UPI for order #MKT2891.',
    time: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
  },
  {
    id: 'n3',
    type: 'order',
    color: '#1e90ff',
    emoji: '📦',
    title: 'Order Confirmed',
    message: 'Great news! Your order #MKT2891 is confirmed by the seller.',
    time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: true,
  },
  {
    id: 'n4',
    type: 'promo',
    color: '#ff4757',
    emoji: '🔥',
    title: 'Flash Sale — 40% Off!',
    message: 'Today only: All accessories up to 40% off. Shop now!',
    time: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    read: true,
  },
];

const STORAGE_KEY = 'me_notifications';

function loadNotifications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return SEED_NOTIFICATIONS;
}

function persist(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (_) {}
}

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(loadNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      persist(updated);
      return updated;
    });
  }, []);

  const markRead = useCallback((id) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      persist(updated);
      return updated;
    });
  }, []);

  const deleteNotification = useCallback((id) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      persist(updated);
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    persist([]);
  }, []);

  const addNotification = useCallback((notif) => {
    const newItem = {
      id: `n_${Date.now()}`,
      time: new Date().toISOString(),
      read: false,
      ...notif,
    };
    setNotifications((prev) => {
      const updated = [newItem, ...prev];
      persist(updated);
      return updated;
    });
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAllRead,
        markRead,
        deleteNotification,
        clearAll,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider');
  return ctx;
};
