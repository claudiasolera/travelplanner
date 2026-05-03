import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

export const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [registered, setRegistered] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        
        setError('');
        setLoading(true);
        try {
            await authService.register(formData);
            setRegistered(true);
        } catch (err: any) {
            const msg = err?.message || '';
            if (msg.includes('409') || msg.includes('existe') || msg.includes('duplicate')) {
                setError('Ya existe una cuenta con ese email');
            } else {
                setError('Error al crear la cuenta. Inténtalo de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-primary-light flex items-center justify-center p-4">
            <div className="w-full max-w-sm space-y-6">
                <div className="text-center">
                    <img src="/logo.png" width={150} height={150} alt="logo" className="mx-auto mb-3" />
                    <h1 className="text-2xl font-bold text-text">Crea tu cuenta</h1>
                    <p className="text-sm text-text-secondary mt-1">Únete a la comunidad de viajeros</p>
                </div>

                <div className="card-lg p-8 space-y-5 rounded-3xl">
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="label">Nombre de usuario</label>
                            <input 
                                aria-label="Nombre de usuario"
                                type="text" required placeholder="Tu nombre"
                                className="w-full input px-4 py-2.5"
                                onChange={e => setFormData({ ...formData, name: e.target.value })} 
                            />
                        </div>
                        <div>
                            <label className="label">Email</label>
                            <input 
                                aria-label="Email de registro"
                                type="email" required placeholder="tu@email.com"
                                className="w-full input px-4 py-2.5"
                                onChange={e => setFormData({ ...formData, email: e.target.value })} 
                            />
                        </div>
                        <div>
                            <label className="label">Contraseña</label>
                            <input 
                                aria-label="Contraseña de registro"
                                type="password" required placeholder="Mínimo 6 caracteres"
                                className="w-full input px-4 py-2.5"
                                onChange={e => setFormData({ ...formData, password: e.target.value })} 
                            />
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-sm text-red-600 text-center">
                                    {error}
                                </div>
                            )}
                            <div className="flex justify-center">
                                <button 
                                    aria-label="Registrarse"
                                    type="submit" disabled={loading} 
                                    className="btn px-8 py-2.5"
                                >
                                    {loading ? 'Creando cuenta...' : 'Registrarse'}
                                </button>
                            </div>
                        </div>
                    </form>
                    {registered && (
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-sm text-green-700 text-center">
                            ¡Cuenta creada! Revisa tu email para verificar tu cuenta antes de iniciar sesión.
                        </div>
                    )}
                    <p className="text-center text-sm text-text-secondary">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login" className="text-primary hover:underline font-medium">Inicia sesión</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};