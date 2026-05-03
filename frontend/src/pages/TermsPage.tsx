export const TermsPage = () => {
    return (
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-text">Términos de Uso</h1>
                <p className="text-xs text-text-soft mt-1">Última actualización: abril 2026</p>
            </div>

            <section className="space-y-3">
                <h2 className="text-base font-semibold text-text">1. Aceptación de los términos</h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                    Al registrarse y utilizar Travel Planner, el usuario acepta los presentes términos de uso en su totalidad. Si no está de acuerdo con alguno de estos términos, deberá abstenerse de utilizar la plataforma.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-base font-semibold text-text">2. Descripción del servicio</h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                    Travel Planner es una plataforma web de planificación de viajes que permite a los usuarios buscar vuelos y hoteles, organizar itinerarios, gestionar gastos, comparar opciones de transporte, explorar puntos de interés y compartir experiencias con la comunidad. Se trata de un proyecto académico sin ánimo de lucro.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-base font-semibold text-text">3. Registro y cuenta de usuario</h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                    Para acceder a las funcionalidades completas de la plataforma es necesario crear una cuenta proporcionando un correo electrónico válido y una contraseña. El usuario es responsable de mantener la confidencialidad de sus credenciales y de todas las actividades realizadas desde su cuenta.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-base font-semibold text-text">4. Uso aceptable</h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                    El usuario se compromete a utilizar la plataforma de forma responsable y legal. Queda prohibido publicar contenido ofensivo, difamatorio o ilegal en comentarios, valoraciones o cualquier otra sección pública; utilizar la plataforma con fines comerciales no autorizados; intentar acceder a cuentas de otros usuarios o comprometer la seguridad del sistema; y realizar un uso abusivo de las APIs integradas en la plataforma.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-base font-semibold text-text">5. Contenido del usuario</h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                    Los viajes, comentarios, valoraciones y cualquier contenido publicado por el usuario son responsabilidad exclusiva del mismo. Al publicar un viaje como público, el usuario autoriza a otros usuarios a visualizarlo y clonarlo como base para sus propios viajes. El usuario puede eliminar su contenido en cualquier momento.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-base font-semibold text-text">6. Información de terceros</h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                    La información sobre vuelos, hoteles, precios, horarios y disponibilidad se obtiene de proveedores externos (Duffel, LiteAPI) y puede variar sin previo aviso. Travel Planner no garantiza la exactitud, disponibilidad ni vigencia de esta información y no actúa como agencia de viajes ni intermediario en la contratación de servicios turísticos.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-base font-semibold text-text">7. Inteligencia artificial</h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                    Algunas funcionalidades de la plataforma utilizan inteligencia artificial para generar recomendaciones, guías de destino y sugerencias de transporte. Esta información se genera de forma automática y tiene carácter orientativo. El usuario debe verificar la información relevante por medios oficiales antes de tomar decisiones de viaje.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-base font-semibold text-text">8. Limitación de responsabilidad</h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                    Travel Planner se ofrece "tal cual" sin garantías de ningún tipo. Al tratarse de un proyecto académico, no se garantiza la disponibilidad continua del servicio ni la ausencia de errores. Travel Planner no será responsable de daños directos o indirectos derivados del uso de la plataforma o de la información proporcionada por la misma.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-base font-semibold text-text">9. Modificaciones</h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                    Travel Planner se reserva el derecho de modificar estos términos en cualquier momento. Las modificaciones serán efectivas desde su publicación en esta página. El uso continuado de la plataforma tras la publicación de cambios implica la aceptación de los mismos.
                </p>
            </section>

            <div className="pt-4 border-t border-border">
                <p className="text-xs text-text-soft">
                    Si tiene alguna pregunta sobre estos términos, contacte con nosotros en soporte@travelplanner.app.
                </p>
            </div>
        </div>
    );
};