import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle, Info, AlertTriangle, XCircle, Package, X } from 'lucide-react';

/* ============================================================
   Toast Context — provides showToast() globally
   ============================================================ */

const ToastContext = createContext(null);

let toastIdCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timeoutRefs = useRef({});

  const removeToast = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, hiding: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      delete timeoutRefs.current[id];
    }, 350);
  }, []);

  const showToast = useCallback(
    ({ title, message, type = 'order', duration = 4000 }) => {
      const id = ++toastIdCounter;
      setToasts((prev) => [...prev, { id, title, message, type, hiding: false }]);

      timeoutRefs.current[id] = setTimeout(() => removeToast(id), duration);
      return id;
    },
    [removeToast]
  );

  const iconMap = {
    success: <CheckCircle size={20} />,
    info:    <Info size={20} />,
    warning: <AlertTriangle size={20} />,
    error:   <XCircle size={20} />,
    order:   <Package size={20} />,
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Renderer */}
      <div className="toast-container" aria-live="polite" aria-atomic="false">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type}${toast.hiding ? ' hiding' : ''}`}
            role="alert"
          >
            <div className="toast-icon-wrap">
              {iconMap[toast.type] || iconMap.order}
            </div>
            <div className="toast-body">
              <div className="toast-title">{toast.title}</div>
              <div className="toast-message">{toast.message}</div>
            </div>
            <button
              className="toast-close"
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
