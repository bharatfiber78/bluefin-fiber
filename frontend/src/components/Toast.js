import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  }[type];

  const icon = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  }[type];

  return (
    <div
      className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-slideIn flex items-center gap-3 min-w-[300px]`}
    >
      <span className="text-2xl font-bold">{icon}</span>
      <span className="flex-1 font-medium">{message}</span>
      <button
        onClick={onClose}
        className="text-white hover:text-gray-200 font-bold text-xl"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;

