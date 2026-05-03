export const PrivacyPage = () => {
    return (
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-text">Política de Privacidad</h1>
                <p className="text-xs text-text-soft mt-1">Última actualización: abril 2026</p>
            </div>

            <section className="space-y-3">
                <h2 className="text-base font-semibold text-text">1. Responsable del tratamiento</h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                    Travel Planner es un proyecto académico desarrollado como Trabajo de Fin de Ciclo de Desarrollo de Aplicaciones Web (DAW). Para cualquier consulta relacionada con la privacidad, puede contactar a través de soporte@travelplanner.app.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-base font-semibold text-text">2. Datos que recopilamos</h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                    Recopilamos los datos que el usuario proporciona voluntariamente al registrarse y utilizar la plataforma: nombre, dirección de correo electrónico, contraseña (almacenada de forma cifrada), avatar de perfil, así como los datos relativos a los viajes creados (destinos, fechas, presupuestos, itinerarios, gastos y preferencias de viaje).
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-base font-semibold text-text">3. Finalidad del tratamiento</h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                    Los datos recopilados se utilizan exclusivamente para el funcionamiento de la plataforma: gestionar la cuenta del usuario, permitir la creación y organización de viajes, ofrecer recomendaciones personalizadas, facilitar la colaboración entre usuarios y mantener las funcionalidades sociales (comunidad, comentarios, valoraciones y seguidores).
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-base font-semibold text-text">4. Almacenamiento y seguridad</h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                    Los datos se almacenan en una base de datos PostgreSQL protegida. Las contraseñas se cifran mediante bcrypt antes de su almacenamiento. La comunicación entre el cliente y el servidor se realiza a través de HTTPS. Los tokens de autenticación (JWT) tienen una duración limitada y se transmiten de forma segura.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-base font-semibold text-text">5. Servicios de terceros</h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                    La plataforma utiliza servicios externos para ofrecer sus funcionalidades: Duffel para la búsqueda de vuelos, LiteAPI para hoteles, OpenStreetMap y Leaflet para mapas, Cloudinary para el almacenamiento de imágenes y OpenWeather para datos meteorológicos. Cada uno de estos servicios tiene su propia política de privacidad. Travel Planner no comparte datos personales del usuario con estos servicios más allá de lo necesario para realizar las consultas solicitadas.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-base font-semibold text-text">6. Derechos del usuario</h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                    El usuario puede ejercer en cualquier momento sus derechos de acceso, rectificación, supresión y portabilidad de sus datos, así como los de limitación y oposición al tratamiento, contactando a través de soporte@travelplanner.app. El usuario puede eliminar su cuenta y todos los datos asociados desde la configuración de su perfil.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-base font-semibold text-text">7. Cookies</h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                    Travel Planner utiliza únicamente cookies técnicas necesarias para el funcionamiento de la plataforma (autenticación y preferencias de sesión). No se utilizan cookies de seguimiento, publicidad ni analítica de terceros.
                </p>
            </section>

            <div className="pt-4 border-t border-border">
                <p className="text-xs text-text-soft">
                    Si tiene alguna pregunta sobre esta política, contacte con nosotros en soporte@travelplanner.app.
                </p>
            </div>
        </div>
    );
};