import { Link } from 'react-router-dom';

export const Footer = () => {
    return (
        <footer className="bg-card px-4 sm:px-6 md:px-10 py-8 sm:py-10 text-text border-t border-border shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
            <div className="max-w-2xl mx-auto grid grid-cols-2 gap-8 justify-items-center text-center">

                <div className="space-y-3">
                    <p className="font-bold text-text tracking-tight text-sm">Explorar</p>
                    <ul className="space-y-2 text-xs text-text-secondary">
                        <li><Link to="/" className="hover:text-primary transition">Inicio</Link></li>
                        <li><Link to="/explore" className="hover:text-primary transition">Destinos</Link></li>
                        <li><Link to="/community" className="hover:text-primary transition">Comunidad</Link></li>
                        <li><Link to="/create-trip" className="hover:text-primary transition">Crear viaje</Link></li>
                    </ul>
                </div>

                <div className="space-y-3">
                    <p className="font-bold text-text tracking-tight text-sm">Soporte</p>
                    <ul className="space-y-2 text-xs text-text-secondary">
                        <li><Link to="/privacy" className="hover:text-primary transition">Política de privacidad</Link></li>
                        <li><Link to="/terms" className="hover:text-primary transition">Términos de uso</Link></li>
                        <li><a 
                            href="mailto:soporte@travelplanner.app" 
                            className="hover:text-primary transition"
                            aria-label="Enviar correo electrónico de soporte"
                        >
                            Contacto
                        </a></li>
                    </ul>
                </div>

            </div>

            <div className="max-w-6xl mx-auto mt-8 pt-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-text-soft">
                <p>© {new Date().getFullYear()} Travel Planner. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};