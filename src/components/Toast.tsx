import React from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="toast-notification">
      <div className="toast-content">
        <CheckCircle2 size={18} className="toast-icon" />
        <span className="toast-text">{message}</span>
      </div>
      <button className="toast-close-btn" onClick={onClose} aria-label="Close notification">
        <X size={15} />
      </button>
    </div>
  );
};
