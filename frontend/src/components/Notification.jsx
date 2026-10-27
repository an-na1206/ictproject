import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Notification = ({ notification, onClose }) => {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  const { type, message } = notification;

  return (
    <aside
      className={`notification-toast toast-${type || 'info'}`}
      role="status"
      aria-live="polite"
    >
      <div className="toast-icon">
        {type === 'success' && <CheckCircle2 size={20} />}
        {type === 'error' && <AlertCircle size={20} />}
        {type === 'info' && <Info size={20} />}
      </div>
      <div className="toast-message">{message}</div>
      <button
        onClick={onClose}
        className="toast-close-btn"
        aria-label="Dismiss notification"
      >
        <X size={16} />
      </button>
    </aside>
  );
};

export default Notification;
