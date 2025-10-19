import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Create a simple event emitter for toast notifications
class ToastEmitter {
  constructor() {
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  emit(toast) {
    this.listeners.forEach(listener => listener(toast));
  }
}

const toastEmitter = new ToastEmitter();

// Export the toast function
export const toast = {
  success: (message, options = {}) => {
    toastEmitter.emit({ type: 'success', message, ...options });
  },
  error: (message, options = {}) => {
    toastEmitter.emit({ type: 'error', message, ...options });
  },
  warning: (message, options = {}) => {
    toastEmitter.emit({ type: 'warning', message, ...options });
  },
  info: (message, options = {}) => {
    toastEmitter.emit({ type: 'info', message, ...options });
  },
};

export const Toaster = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = toastEmitter.subscribe(toast => {
      const id = Date.now();
      const newToast = { ...toast, id };
      
      setToasts(prev => [...prev, newToast]);
      
      // Auto remove after duration (default 3 seconds)
      const duration = toast.duration || 3000;
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    });

    return unsubscribe;
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'info':
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg min-w-[300px] max-w-[500px] ${getStyles(toast.type)}`}
          >
            {getIcon(toast.type)}
            <p className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};