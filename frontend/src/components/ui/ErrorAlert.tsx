import React from 'react';

interface ErrorAlertProps {
    message: string | null;
    onClose: () => void;
}

export const ErrorAlert = ({ message, onClose }: ErrorAlertProps) => {
    if (!message) return null;

    return (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 flex items-center gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" className="shrink-0">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p className="text-sm text-red-600 grow">{message}</p>
            <button 
                aria-label='Cerrar'
                onClick={onClose} 
                className="text-red-400 hover:text-red-600 transition shrink-0"
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
                </svg>
            </button>
        </div>
    );
};