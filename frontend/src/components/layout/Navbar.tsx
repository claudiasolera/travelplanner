import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { icons } from '../../lib/cloudinary';

export const Navbar = () => {
    const { user, isAuthenticated, logoutUser } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const handleLogout = async () => {
        await authService.logout();
        logoutUser();
        setMenuOpen(false);
    };

    const closeMenu = () => setMenuOpen(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-10 lg:px-20 py-3 flex items-center justify-between w-full border-b transition-all duration-300 ${
                scrolled
                    ? 'bg-white/95 backdrop-blur-md border-border shadow-md'
                    : 'bg-card border-transparent shadow-none'
                }`}
            >

                <Link 
                    to="/" 
                    onClick={closeMenu} 
                    className="flex items-center shrink-0"
                >
                    <img src="/logo.png" className="w-16 md:w-20 h-auto" alt="Logo" />
                </Link>

                <div className="hidden lg:flex gap-4 items-center font-medium text-sm">
                    <Link 
                        to="/explore" 
                        className="nav-link"
                    >
                        <img src={icons.magnifyingGlass} width={28} height={28} alt="Explorar" />
                        Explorar
                    </Link>
                    <Link 
                        to="/community" 
                        className="nav-link"
                    >
                        <img src={icons.community} width={28} height={28} alt="Comunidad" />
                        Comunidad
                    </Link>
                    {isAuthenticated && (
                        <>
                            <Link 
                                to="/my-trips" 
                                className="nav-link"
                            >
                                <img src={icons.backpack} width={28} height={28} alt="Mis viajes" />
                                Mis Viajes
                            </Link>
                            <Link 
                                to="/profile" 
                                className="nav-link"
                            >
                                <img src={icons.profile} width={28} height={28} alt="Perfil" />
                                Perfil
                            </Link>
                        </>
                    )}
                </div>

                <div className="hidden lg:flex items-center gap-3">
                    {isAuthenticated ? (
                        <button 
                            aria-label="Cerrar sesión"
                            onClick={handleLogout} className="btn"
                        >
                            Cerrar sesión
                        </button>
                    ) : (
                        <>
                            <Link to="/login" className="btn-login">
                                Iniciar Sesión
                            </Link>
                            <Link to="/register" className="btn">
                                Registrarse
                            </Link>
                        </>
                    )}
                </div>

                <button
                    aria-label="Abrir menú"
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-black/5 transition shrink-0"
                >
                    {menuOpen ? (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    ) : (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    )}
                </button>
            </nav>

            {menuOpen && (
                <div
                    onClick={closeMenu}
                    className="lg:hidden fixed inset-0 bg-black/40 z-40 animate-fade-in"
                    style={{ top: '64px' }}
                />
            )}

            <div
                className={`lg:hidden fixed left-0 right-0 bg-card z-40 border-b border-border shadow-lg transition-all duration-300 ${
                    menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
                }`}
                style={{ top: '64px' }}
            >
                <div className="px-4 py-4 flex flex-col gap-1">
                    <Link 
                        to="/explore" 
                        onClick={closeMenu} 
                        className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-black/5 transition text-text font-medium"
                    >
                        <img src={icons.magnifyingGlass} width={24} height={24} alt="Explorar" />
                        Explorar
                    </Link>
                    <Link 
                        to="/community" 
                        onClick={closeMenu} 
                        className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-black/5 transition text-text font-medium"
                    >
                        <img src={icons.community} width={24} height={24} alt="Comunidad" />
                        Comunidad
                    </Link>
                    {isAuthenticated && (
                        <>
                            <Link 
                                to="/my-trips" 
                                onClick={closeMenu} 
                                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-black/5 transition text-text font-medium"
                            >
                                <img src={icons.backpack} width={24} height={24} alt="Mis Viajes" />
                                Mis Viajes
                            </Link>
                            <Link 
                                to="/profile" 
                                onClick={closeMenu} 
                                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-black/5 transition text-text font-medium"
                            >
                                <img src={icons.profile} width={24} height={24} alt="Perfil" />
                                Perfil
                            </Link>
                        </>
                    )}

                    <div className="border-t border-border mt-2 pt-3 flex flex-col gap-2">
                        {isAuthenticated ? (
                            <button 
                                aria-label="Cerrar sesión"
                                onClick={handleLogout} 
                                className="btn w-full"
                            >
                                Cerrar sesión
                            </button>
                        ) : (
                            <>
                                <Link to="/login" onClick={closeMenu} className="btn-login text-center">
                                    Iniciar Sesión
                                </Link>
                                <Link to="/register" onClick={closeMenu} className="btn text-center">
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};