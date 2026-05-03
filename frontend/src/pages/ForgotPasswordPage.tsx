import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../services/apiClient';

export const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!email) return;
        setLoading(true);
        setError('');
        try {
            await apiClient('/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify({ email })
            });
            setSent(true);
        } catch {
            setError('Error al procesar la solicitud. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg flex items-center justify-center px-4">
            <div className="card-lg rounded-3xl p-10 max-w-md w-full space-y-6">
                <div className="text-center">
                    <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                            <path d="M4 4h16v16H4z" rx="2"/><path d="M22 6l-10 7L2 6"/>
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-text">Recuperar contraseña</h1>
                    <p className="text-text-secondary text-sm mt-1">Te enviaremos un enlace para restablecer tu contraseña.</p>
                </div>

                {sent ? (
                    <div className="text-center space-y-4">
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                            <p className="text-sm text-green-700">Si el email existe en nuestra base de datos, recibirás un enlace en breve.</p>
                        </div>
                        <Link to="/login" className="btn inline-flex px-8">Volver al inicio</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="label">Email</label>
                            <input 
                                aria-label="Email de recuperación"
                                className="input px-3 py-2.5 w-full" type="email"
                                placeholder="tu@email.com" value={email}
                                onChange={e => setEmail(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSubmit()} 
                            />
                        </div>
                        {error && <p className="field-error">{error}</p>}
                        <button 
                            aria-label="Enviar enlace"
                            onClick={handleSubmit} disabled={loading || !email}
                            className="btn w-full justify-center disabled:opacity-50"
                        >
                            {loading ? <><div className="spinner-sm" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }}/> Enviando...</> : 'Enviar enlace'}
                        </button>
                        <p className="text-center text-sm text-text-secondary">
                            <Link to="/login" className="text-primary hover:underline">Volver al inicio de sesión</Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};