import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../services/apiClient';

export const VerifyEmailPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const called = useRef(false);

    useEffect(() => {
        if (called.current) return;
        called.current = true;
        
        const token = searchParams.get('token');
        if (!token) { setStatus('error'); return; }

        apiClient(`/auth/verify-email?token=${token}`)
            .then(() => setStatus('success'))
            .catch(() => setStatus('error'));
    }, []);
    return (
        <div className="min-h-screen bg-bg flex items-center justify-center px-4">
            <div className="card-lg rounded-3xl p-10 max-w-md w-full text-center space-y-4">
                {status === 'loading' && (
                    <>
                        <div className="spinner-lg mx-auto"/>
                        <p className="text-text-secondary text-sm">Verificando tu cuenta...</p>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                                <path d="M20 6L9 17l-5-5" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-text">¡Email verificado!</h1>
                        <p className="text-text-secondary text-sm">Tu cuenta ha sido verificada correctamente. Ya puedes iniciar sesión.</p>
                        <button 
                            aria-label="Iniciar sesión"
                            onClick={() => navigate('/login')} 
                            className="btn px-8"
                        >
                            Iniciar sesión
                        </button>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5">
                                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-text">Enlace inválido</h1>
                        <p className="text-text-secondary text-sm">El enlace de verificación es inválido o ha expirado.</p>
                        <button 
                            aria-label="Volver al inicio"
                            onClick={() => navigate('/login')} 
                            className="btn px-8"
                        >
                            Volver al inicio
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};