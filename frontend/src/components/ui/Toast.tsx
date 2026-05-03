import { JSX, useEffect, useState } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    message: string;
    type?: ToastType;
    duration?: number;
    onClose: () => void;
}

const styles: Record<ToastType, string> = {
    success: 'bg-green-50 border-green-400 text-green-700',
    error: 'bg-red-50 border-red-400 text-red-700',
    info: 'bg-blue-50 border-primary text-primary',
    warning: 'bg-amber-50 border-amber-400 text-amber-700',
};

const icons: Record<ToastType, JSX.Element> = {
    success: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" strokeLinecap="round"/></svg>,
    error: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/></svg>,
    info: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01" strokeLinecap="round"/></svg>,
    warning: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round"/></svg>,
};

export const Toast = ({ message, type = 'info', duration = 4000, onClose }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm font-medium animate-fade-in ${styles[type]}`}
            style={{ minWidth: '280px', maxWidth: '400px' }}>
            <span className="shrink-0">{icons[type]}</span>
            <span className="flex-1">{message}</span>
            <button 
                aria-label='Cerrar'
                onClick={onClose} 
                className="shrink-0 opacity-60 hover:opacity-100 transition"
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
                </svg>
            </button>
        </div>
    );
};