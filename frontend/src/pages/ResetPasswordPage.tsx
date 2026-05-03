import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../services/apiClient';

export const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        if (password !== confirm) { setError('Las contraseñas no coinciden'); return; }
        if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return; }

        setLoading(true);
        setError('');
        try {
            const token = searchParams.get('token');
            await apiClient('/auth/reset-password', {
                method: 'POST',
                body: JSON.stringify({ token, password })
            });
            setSuccess(true);
        } catch {
            setError('El enlace es inválido o ha expirado.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-primary-light flex items-center justify-center px-4">
            <div className="card-lg rounded-3xl p-10 max-w-md w-full space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-text">Nueva contraseña</h1>
                    <p className="text-text-secondary text-sm mt-1">Introduce tu nueva contraseña.</p>
                </div>

                {success ? (
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                                <path d="M20 6L9 17l-5-5" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <p className="text-sm text-text-secondary">Contraseña actualizada correctamente.</p>
                        <button 
                            aria-label="Iniciar sesión"
                            onClick={() => navigate('/login')} 
                            className="btn px-8"
                        >
                            Iniciar sesión
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="label">Nueva contraseña</label>
                            <input 
                                aria-label="Nueva contraseña"
                                className="input px-3 py-2.5 w-full" type="password"
                                placeholder="Mínimo 6 caracteres" value={password}
                                onChange={e => setPassword(e.target.value)} 
                            />
                        </div>
                        <div>
                            <label className="label">Confirmar contraseña</label>
                            <input 
                                aria-label="Confirmar contraseña"
                                className="input px-3 py-2.5 w-full" type="password"
                                placeholder="Repite la contraseña" value={confirm}
                                onChange={e => setConfirm(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSubmit()} 
                            />
                        </div>
                        {error && <p className="field-error">{error}</p>}
                        <button 
                            aria-label="Guardar contraseña"
                            onClick={handleSubmit} disabled={loading || !password || !confirm}
                            className="btn w-full justify-center disabled:opacity-50"
                        >
                            {loading ? <><div className="spinner-sm" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }}/> Guardando...</> : 'Guardar contraseña'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};