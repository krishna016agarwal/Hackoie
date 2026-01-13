import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

interface PopupProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="
        fixed
        bottom-8
        right-8
     
        
        z-[9999]
        pointer-events-auto
        animate-bounce-in
      "
    >
      <div
        className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${
          type === 'success'
            ? 'bg-white border-lime-custom text-black'
            : 'bg-white border-red-200 text-red-600'
        }`}
      >
        {type === 'success' ? (
          <CheckCircle size={20} className="text-lime-custom" />
        ) : (
          <AlertCircle size={20} />
        )}

        <span className="font-medium">{message}</span>

        <button onClick={onClose} className="ml-4 hover:opacity-70">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Popup;
