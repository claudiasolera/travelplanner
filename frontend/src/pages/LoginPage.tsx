import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await authService.login({ email, password });
            loginUser(response.user, response.token);
            navigate('/my-trips');
        } catch {
            setError('Email o contraseña incorrectos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-primary-light flex items-center justify-center p-4">
            <div className="w-full max-w-sm space-y-6">
                <div className="text-center">
                    <img src="/logo.png" width={150} height={150} alt="Logo Trip Planner" className="mx-auto mb-3" />
                    <h1 className="text-2xl font-bold text-text">Bienvenido de vuelta</h1>
                    <p className="text-sm text-text-secondary mt-1">Inicia sesión para continuar tu aventura</p>
                </div>

                <div className="card-lg p-8 space-y-5 rounded-3xl">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="label">Email</label>
                            <input 
                                aria-label="Email de inicio de sesión"
                                type="email" 
                                required placeholder="tu@email.com"
                                className="w-full input px-4 py-2.5"
                                onChange={e => setEmail(e.target.value)} 
                            />
                        </div>
                        <div>
                            <label className="label">Contraseña</label>
                            <input 
                                aria-label="Contraseña de inicio de sesión"
                                type="password" 
                                required placeholder="••••••••"
                                className="w-full input px-4 py-2.5"
                                onChange={e => { setPassword(e.target.value); setError(''); }} 
                            />
                        </div>
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-sm text-red-600 text-center">
                                {error}
                            </div>
                        )}
                        <div className="flex justify-center">
                            <button 
                                aria-label="Iniciar sesión"
                                type="submit" disabled={loading} 
                                className="btn px-8 py-2.5"
                            >
                                {loading ? 'Entrando...' : 'Iniciar sesión'}
                            </button>
                        </div>
                    </form>
                    <div className="text-center">
                        <p className="text-center text-sm text-text-secondary">
                            ¿No tienes cuenta?{' '}
                            <Link to="/register" className="text-primary hover:underline font-medium">Regístrate aquí</Link>
                        </p>
                        <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                            He olvidado mi contraseña
                        </Link>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};