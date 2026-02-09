import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorMessage = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center justify-between gap-3 animate-shake mb-6">
            <div className="flex items-center gap-3">
                <AlertCircle size={20} />
                <p className="text-sm font-medium">{message}</p>
            </div>
            {onClose && (
                <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-lg transition-colors">
                    <X size={16} />
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;
