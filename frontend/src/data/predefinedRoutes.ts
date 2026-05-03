import { routes } from "../lib/cloudinary";

export interface RouteEvent {
    time: string;
    title: string;
    type: 'activity' | 'food' | 'hotel' | 'transport';
    description?: string;
    image?: string;
}

export interface RouteDay {
    dayNumber: number;
    title: string;
    image?: string;
    events: RouteEvent[];
}

export interface PredefinedRoute {
    id: string;
    title: string;
    description: string;
    cover: string;
    destination: string;
    days: number;
    tag: string;
    itinerary: RouteDay[];
}

export const predefinedRoutes: PredefinedRoute[] = [
    {
        id: 'japon-10-dias',
        title: 'Explora Japón en 10 días',
        description: 'Tokio, Kioto, Osaka y Nara en una ruta perfectamente equilibrada.',
        cover: routes.japan.hero,
        destination: 'Japón',
        days: 10,
        tag: 'Asia',
        itinerary: [
            {
                dayNumber: 1,
                title: 'Llegada a Tokio',
                events: [
                    {
                        time: '15:00', type: 'hotel',
                        title: 'Check-in hotel en Shinjuku',
                        description: 'Shinjuku es el centro neurálgico de Tokio. Hoteles modernos a pasos de la estación más transitada del mundo.',
                        image: routes.japan.itinerary.shinjuku,
                    },
                    {
                        time: '19:00', type: 'food',
                        title: 'Cena en Ramen Street',
                        description: 'Ocho de los mejores restaurantes de ramen de Tokio reunidos en un pasillo subterráneo bajo la estación de Tokio.',
                        image: routes.japan.restaurants.ramenStreet,
                    },
                    {
                        time: '21:00', type: 'activity',
                        title: 'Paseo nocturno por Shinjuku',
                        description: 'Los neones de Kabukicho y Golden Gai, el barrio de bares de una sola mesa, ofrecen una noche tokiota inigualable.',
                        image: routes.japan.itinerary.shinjukuNight,
                    },
                ]
            },
            {
                dayNumber: 2,
                title: 'Tokio histórico',
                events: [
                    {
                        time: '09:00', type: 'activity',
                        title: 'Templo Senso-ji en Asakusa',
                        description: 'El templo más antiguo de Tokio, fundado en 628 d.C. La puerta Kaminarimon y el mercado Nakamise son paradas obligadas.',
                        image: routes.japan.itinerary.sensoji,
                    },
                    {
                        time: '13:00', type: 'food',
                        title: 'Almuerzo en Ueno',
                        description: 'El barrio de Ueno concentra izakayas tradicionales y restaurantes de sushi a buen precio junto al famoso parque.',
                        image: routes.japan.restaurants.ueno,
                    },
                    {
                        time: '15:00', type: 'activity',
                        title: 'Akihabara',
                        description: 'El epicentro mundial de la cultura manga, anime y electrónica. Tiendas de varios pisos con coleccionables únicos.',
                        image: routes.japan.itinerary.akihabara,
                    },
                ]
            },
            {
                dayNumber: 3,
                title: 'Tokio moderno',
                events: [
                    {
                        time: '10:00', type: 'activity',
                        title: 'Shibuya Crossing',
                        description: 'El cruce peatonal más famoso del mundo. Hasta 3.000 personas lo cruzan en cada cambio de semáforo.',
                        image: routes.japan.itinerary.shibuya,
                    },
                    {
                        time: '13:00', type: 'activity',
                        title: 'Harajuku y Takeshita Street',
                        description: 'La calle del street style japonés más extravagante. Crepes coloridos, moda alternativa y cultura kawaii.',
                        image: routes.japan.itinerary.harajuku,
                    },
                    {
                        time: '19:00', type: 'food',
                        title: 'Cena en Roppongi',
                        description: 'Barrio cosmopolita con restaurantes internacionales de alto nivel y una vibrante vida nocturna.',
                        image: routes.japan.itinerary.roppongi,
                    },
                ]
            },
            {
                dayNumber: 4,
                title: 'Viaje a Kioto',
                events: [
                    {
                        time: '08:00', type: 'transport',
                        title: 'Shinkansen Tokio → Kioto',
                        description: 'El tren bala japonés cubre los 450 km entre Tokio y Kioto en solo 2h 15min. Reserva asiento en el lado derecho para ver el Fuji.',
                        image: routes.japan.itinerary.shinkansen,
                    },
                    {
                        time: '12:00', type: 'hotel',
                        title: 'Check-in ryokan tradicional',
                        description: 'Alójate en un ryokan auténtico con tatami, yukata y cena kaiseki incluida. Una experiencia cultural única.',
                        image: routes.japan.itinerary.ryokan,
                    },
                    {
                        time: '16:00', type: 'activity',
                        title: 'Paseo por Gion',
                        description: 'El barrio de las geishas. Al atardecer es habitual avistar maikos y geikos entre sus calles empedradas.',
                        image: routes.japan.itinerary.gion,
                    },
                ]
            },
            {
                dayNumber: 5,
                title: 'Kioto templos',
                events: [
                    {
                        time: '07:00', type: 'activity',
                        title: 'Fushimi Inari al amanecer',
                        description: 'Miles de torii naranjas forman túneles en la montaña Inari. Llegar al alba evita las aglomeraciones y la luz es espectacular.',
                        image: routes.japan.itinerary.fushimiInari,
                    },
                    {
                        time: '12:00', type: 'food',
                        title: 'Almuerzo kaiseki',
                        description: 'La alta cocina japonesa: una secuencia de pequeños platos de temporada que refleja el equilibrio y la estética del país.',
                        image: routes.japan.restaurants.kaiseki,
                    },
                    {
                        time: '15:00', type: 'activity',
                        title: 'Kinkaku-ji (Pabellón Dorado)',
                        description: 'Templo zen revestido de pan de oro que se refleja en el lago Kyokochi. Uno de los monumentos más fotografiados de Japón.',
                        image: routes.japan.itinerary.kinkakuji,
                    },
                ]
            },
            {
                dayNumber: 6,
                title: 'Nara de día',
                events: [
                    {
                        time: '09:00', type: 'transport',
                        title: 'Tren a Nara',
                        description: 'Nara está a 45 minutos de Kioto en tren. Fue la primera capital permanente de Japón en el siglo VIII.',
                    },
                    {
                        time: '10:00', type: 'activity',
                        title: 'Ciervos en el Parque de Nara',
                        description: 'Más de 1.000 ciervos sagrados deambulan libremente por el parque. Puedes darles de comer con galletas especiales.',
                        image: routes.japan.itinerary.nara,
                    },
                    {
                        time: '12:00', type: 'activity',
                        title: 'Templo Todai-ji',
                        description: 'Alberga el Gran Buda de bronce más grande del mundo, con 15 metros de altura. El edificio de madera también es el más grande del mundo.',
                        image: routes.japan.itinerary.todaiji,
                    },
                    {
                        time: '17:00', type: 'transport',
                        title: 'Regreso a Kioto',
                        description: 'Tren directo de vuelta para cenar y descansar antes del traslado a Osaka al día siguiente.',
                    },
                ]
            },
            {
                dayNumber: 7,
                title: 'Llegada a Osaka',
                events: [
                    {
                        time: '10:00', type: 'transport',
                        title: 'Tren Kioto → Osaka',
                        description: 'Solo 15 minutos en shinkansen o 30 en tren convencional. Osaka es la capital gastronómica de Japón.',
                        image: undefined,
                    },
                    {
                        time: '12:00', type: 'hotel',
                        title: 'Check-in hotel en Dotonbori',
                        description: 'Alojarse en Dotonbori es estar en el corazón de Osaka: neones, canales y el olor a takoyaki en cada esquina.',
                        image: routes.japan.itinerary.dotonbori,
                    },
                    {
                        time: '19:00', type: 'food',
                        title: 'Street food en Dotonbori',
                        description: 'Takoyaki, okonomiyaki y kushikatsu. El lema de Osaka es "kuidaore": arruinarse comiendo. Esta noche lo entenderás.',
                        image: routes.japan.restaurants.takoyaki,
                    },
                ]
            },
            {
                dayNumber: 8,
                title: 'Osaka ciudad',
                events: [
                    {
                        time: '10:00', type: 'activity',
                        title: 'Castillo de Osaka',
                        description: 'Construido en 1583 por Toyotomi Hideyoshi. Desde su torre se contempla toda la ciudad rodeada de cerezos en primavera.',
                        image: routes.japan.itinerary.osakaCastle,
                    },
                    {
                        time: '14:00', type: 'food',
                        title: 'Takoyaki en Shinsekai',
                        description: 'Shinsekai es un barrio retro de los años 50 famoso por sus bolas de pulpo crujientes por fuera y cremosas por dentro.',
                        image: routes.japan.restaurants.takoyaki,
                    },
                    {
                        time: '17:00', type: 'activity',
                        title: 'Umeda Sky Building',
                        description: 'Dos torres unidas en lo alto por un jardín flotante a 170 metros. Las vistas al atardecer sobre Osaka son extraordinarias.',
                        image: routes.japan.itinerary.umeda,
                    },
                ]
            },
            {
                dayNumber: 9,
                title: 'Día libre en Osaka',
                events: [
                    {
                        time: '10:00', type: 'activity',
                        title: 'Mercado Kuromon',
                        description: 'El "restaurante de cocina de Osaka": 170 puestos de pescado fresco, marisco y delicias locales para comer mientras caminas.',
                        image: routes.japan.itinerary.kuromon,
                    },
                    {
                        time: '14:00', type: 'activity',
                        title: 'Shopping en Shinsaibashi',
                        description: 'La arteria comercial más larga de Osaka con marcas internacionales, tiendas vintage y la galería cubierta más animada del país.',
                        image: routes.japan.itinerary.shinsaibashi,
                    },
                    {
                        time: '20:00', type: 'food',
                        title: 'Cena de despedida',
                        description: 'Última noche en Japón. Elige un restaurante de teppanyaki o un kaiseki para cerrar el viaje por todo lo alto.',
                        image: routes.japan.restaurants.teppanyaki,
                    },
                ]
            },
            {
                dayNumber: 10,
                title: 'Vuelta a casa',
                events: [
                    {
                        time: '06:00', type: 'transport',
                        title: 'Transfer al aeropuerto de Kansai',
                        description: 'El aeropuerto internacional de Kansai está construido sobre una isla artificial en la bahía de Osaka.',
                        image: undefined,
                    },
                    {
                        time: '10:00', type: 'transport',
                        title: 'Vuelo de regreso',
                        description: 'Con los recuerdos de 10 días increíbles. ¡Mata ne, Japón!',
                        image: undefined,
                    },
                ]
            },
        ]
    },
    {
        id: 'castillos-francia',
        title: 'Ruta de castillos por Francia',
        description: 'El Valle del Loira y sus castillos más impresionantes en 7 días.',
        cover: routes.france.hero,
        destination: 'Francia',
        days: 7,
        tag: 'Europa',
        itinerary: [
            {
                dayNumber: 1,
                title: 'Llegada a París',
                events: [
                    {
                        time: '14:00', type: 'hotel',
                        title: 'Check-in hotel en París',
                        description: 'Alojamiento en el centro histórico, a pocos pasos del Sena y los principales monumentos.',
                        image: routes.france.itinerary.paris,
                    },
                    {
                        time: '19:00', type: 'food',
                        title: 'Cena en Le Marais',
                        description: 'El barrio más trendy de París mezcla gastronomía francesa clásica con restaurantes internacionales y bares de vino natural.',
                        image: routes.france.itinerary.lemarais,
                    },
                ]
            },
            {
                dayNumber: 2,
                title: 'Viaje al Valle del Loira',
                events: [
                    {
                        time: '09:00', type: 'transport',
                        title: 'Tren París → Tours',
                        description: 'El TGV cubre el trayecto en 1h. Tours es la puerta de entrada perfecta al Valle del Loira, Patrimonio de la Humanidad.',
                        image: undefined,
                    },
                    {
                        time: '12:00', type: 'hotel',
                        title: 'Check-in château hotel',
                        description: 'Dormir en un castillo convertido en hotel es una experiencia única. Muchos ofrecen visitas privadas y cenas con maridaje.',
                        image: routes.france.itinerary.chateau,
                    },
                    {
                        time: '15:00', type: 'activity',
                        title: 'Castillo de Amboise',
                        description: 'Residencia real del siglo XV donde vivió Leonardo da Vinci sus últimos años. Vistas privilegiadas sobre el río Loira.',
                        image: routes.france.itinerary.amboise,
                    },
                ]
            },
            {
                dayNumber: 3,
                title: 'Castillo de Chambord',
                events: [
                    {
                        time: '09:00', type: 'activity',
                        title: 'Chambord — el más grande del Loira',
                        description: 'Con 440 habitaciones y 365 chimeneas, Chambord es el mayor castillo de la región. Su escalera de doble hélice, atribuida a Da Vinci, es asombrosa.',
                        image: routes.france.itinerary.chambord,
                    },
                    {
                        time: '13:00', type: 'food',
                        title: 'Picnic en los jardines',
                        description: 'Los jardines de Chambord son perfectos para un picnic con quesos y vinos locales mientras contemplas la fachada renacentista.',
                        image: routes.france.itinerary.chambordGrounds,
                    },
                    {
                        time: '16:00', type: 'activity',
                        title: 'Castillo de Cheverny',
                        description: 'A diferencia de otros, Cheverny sigue siendo residencia privada de la misma familia desde el siglo XVII. Famoso por su jauría de 100 sabuesos.',
                        image: routes.france.itinerary.cheverny,
                    },
                ]
            },
            {
                dayNumber: 4,
                title: 'Chenonceau y Villandry',
                events: [
                    {
                        time: '09:00', type: 'activity',
                        title: 'Château de Chenonceau',
                        description: 'El "castillo de las damas" se extiende sobre el río Cher. Construido y habitado principalmente por mujeres, es el más visitado de Francia tras Versalles.',
                        image: routes.france.itinerary.chenonceau,
                    },
                    {
                        time: '14:00', type: 'activity',
                        title: 'Jardines de Villandry',
                        description: 'Los jardines renacentistas más espectaculares de Francia: 6 hectáreas de laberintos vegetales, huertos ornamentales y estanques.',
                        image: routes.france.itinerary.villandry,
                    },
                    {
                        time: '19:00', type: 'food',
                        title: 'Cena con vinos del Loira',
                        description: 'La región produce algunos de los mejores blancos de Francia: Sancerre, Muscadet y Vouvray acompañan un menú de temporada.',
                        image: routes.france.restaurants.brasserie,
                    },
                ]
            },
            {
                dayNumber: 5,
                title: 'Blois y Chaumont',
                events: [
                    {
                        time: '10:00', type: 'activity',
                        title: 'Castillo Real de Blois',
                        description: 'Cuatro siglos de arquitectura francesa en un solo edificio: medieval, gótico, renacimiento e imperial conviven en sus alas.',
                        image: routes.france.itinerary.blois,
                    },
                    {
                        time: '14:00', type: 'activity',
                        title: 'Château de Chaumont',
                        description: 'Famoso por su Festival Internacional de Jardines cada verano. Su posición elevada sobre el Loira ofrece vistas panorámicas únicas.',
                        image: routes.france.itinerary.chaumont,
                    },
                ]
            },
            {
                dayNumber: 6,
                title: 'Regreso a París',
                events: [
                    {
                        time: '10:00', type: 'transport',
                        title: 'Tren Tours → París',
                        description: 'Regreso a la capital para aprovechar la tarde y la noche en la Ciudad de la Luz.',
                        image: undefined,
                    },
                    {
                        time: '14:00', type: 'activity',
                        title: 'Torre Eiffel',
                        description: 'Construida en 1889, recibe 7 millones de visitantes al año. Reserva entradas online para subir al tercer piso y evitar colas.',
                        image: routes.france.itinerary.eiffel,
                    },
                    {
                        time: '20:00', type: 'food',
                        title: 'Cena de despedida en París',
                        description: 'Cierra el viaje con una brasserie clásica parisina: steak frites, escargots y una tarta tatin para terminar.',
                        image: routes.france.restaurants.brasserie,
                    },
                ]
            },
            {
                dayNumber: 7,
                title: 'Vuelta a casa',
                events: [
                    {
                        time: '08:00', type: 'transport',
                        title: 'Transfer al aeropuerto CDG',
                        description: 'Charles de Gaulle es uno de los aeropuertos más grandes de Europa. Llega con al menos 2 horas de antelación.',
                        image: undefined,
                    },
                    {
                        time: '11:00', type: 'transport',
                        title: 'Vuelo de regreso',
                        description: 'Au revoir, France. Hasta el próximo viaje.',
                        image: undefined,
                    },
                ]
            },
        ]
    },
    {
        id: 'italia-clasica',
        title: 'Italia clásica en 8 días',
        description: 'Roma, Florencia y Venecia: el triángulo de oro italiano.',
        cover: routes.italy.hero,
        destination: 'Italia',
        days: 8,
        tag: 'Europa',
        itinerary: [
            {
                dayNumber: 1,
                title: 'Llegada a Roma',
                events: [
                    {
                        time: '14:00', type: 'hotel',
                        title: 'Check-in hotel cerca del Coliseo',
                        description: 'Alojarse en el centro histórico de Roma permite llegar andando a los principales monumentos. El Coliseo iluminado por la noche es un espectáculo.',
                        image: routes.italy.itinerary.coliseumDinner,
                    },
                    {
                        time: '19:00', type: 'food',
                        title: 'Cena en Trastevere',
                        description: 'El barrio más auténtico de Roma: callejuelas empedradas, hiedra en las fachadas y trattorias donde los romanos cenan de verdad.',
                        image: routes.italy.itinerary.trastivere,
                    },
                ]
            },
            {
                dayNumber: 2,
                title: 'Roma antigua',
                events: [
                    {
                        time: '09:00', type: 'activity',
                        title: 'Coliseo y Foro Romano',
                        description: 'El anfiteatro más grande jamás construido, con capacidad para 80.000 espectadores. El Foro Romano adyacente fue el corazón político de la República.',
                        image: routes.italy.itinerary.coliseum,
                    },
                    {
                        time: '14:00', type: 'food',
                        title: 'Pasta en La Carbonara',
                        description: 'La carbonara nació en Roma. Guanciale, pecorino, huevo y pimienta negra: sin nata, sin cebolla, sin ajo. La receta original es sagrada.',
                        image: routes.italy.itinerary.carbonara,
                    },
                    {
                        time: '16:00', type: 'activity',
                        title: 'Fontana di Trevi',
                        description: 'La fuente barroca más famosa del mundo. Lanza una moneda con la mano derecha sobre el hombro izquierdo para garantizar el regreso a Roma.',
                        image: routes.italy.itinerary.fontana,
                    },
                ]
            },
            {
                dayNumber: 3,
                title: 'Vaticano',
                events: [
                    {
                        time: '08:00', type: 'activity',
                        title: 'Museos Vaticanos y Capilla Sixtina',
                        description: 'Una de las colecciones de arte más importantes del mundo culmina en la Capilla Sixtina, con el techo pintado por Miguel Ángel entre 1508 y 1512.',
                        image: routes.italy.itinerary.chapel,
                    },
                    {
                        time: '13:00', type: 'activity',
                        title: 'Plaza de San Pedro',
                        description: 'La columnata de Bernini abraza una plaza que puede albergar 300.000 personas. La cúpula de San Pedro, diseñada por Miguel Ángel, domina el horizonte romano.',
                        image: routes.italy.itinerary.saintpeter,
                    },
                    {
                        time: '19:00', type: 'food',
                        title: 'Aperitivo en Prati',
                        description: 'El barrio burgués junto al Vaticano ofrece los mejores spritz y cicchetti de Roma en sus elegantes bares de la Via Cola di Rienzo.',
                        image: routes.italy.itinerary.prati,
                    },
                ]
            },
            {
                dayNumber: 4,
                title: 'Viaje a Florencia',
                events: [
                    {
                        time: '09:00', type: 'transport',
                        title: 'Tren Roma → Florencia',
                        description: 'El Frecciarossa cubre los 280 km en 1h 30min. Florencia, cuna del Renacimiento, espera con toda su belleza.',
                        image: undefined,
                    },
                    {
                        time: '12:00', type: 'hotel',
                        title: 'Check-in hotel en el centro',
                        description: 'Alojarse dentro del anillo de los Viali permite recorrer los Uffizi, el Duomo y el Ponte Vecchio a pie sin necesidad de transporte.',
                        image: routes.italy.itinerary.uffizi,
                    },
                    {
                        time: '16:00', type: 'activity',
                        title: 'Ponte Vecchio y Uffizi (exterior)',
                        description: 'El puente más antiguo de Florencia, repleto de joyerías desde el siglo XVI. Por fuera, la fachada de los Uffizi ya anticipa la grandeza que hay dentro.',
                        image: routes.italy.itinerary.vecchio,
                    },
                ]
            },
            {
                dayNumber: 5,
                title: 'Florencia arte',
                events: [
                    {
                        time: '09:00', type: 'activity',
                        title: 'Galería Uffizi',
                        description: 'La colección de arte renacentista más importante del mundo: Botticelli, Leonardo, Rafael y Miguel Ángel conviven en un palacio del siglo XVI.',
                        image: routes.italy.itinerary.uffiziGallery,
                    },
                    {
                        time: '14:00', type: 'activity',
                        title: 'David de Miguel Ángel (Accademia)',
                        description: 'La escultura más famosa del mundo mide 5,17 metros. Miguel Ángel la talló en un solo bloque de mármol de Carrara entre 1501 y 1504.',
                        image: routes.italy.itinerary.david,
                    },
                    {
                        time: '19:00', type: 'food',
                        title: 'Cena con vista al Duomo',
                        description: 'Varios restaurantes en los alrededores de la catedral ofrecen terrazas con vistas directas a la cúpula de Brunelleschi al atardecer.',
                        image: routes.italy.itinerary.duomo,
                    },
                ]
            },
            {
                dayNumber: 6,
                title: 'Viaje a Venecia',
                events: [
                    {
                        time: '09:00', type: 'transport',
                        title: 'Tren Florencia → Venecia',
                        description: 'El tren llega directamente a la estación Santa Lucía, en el corazón de Venecia. Al salir, el Gran Canal te recibe de golpe.',
                        image: undefined,
                    },
                    {
                        time: '12:00', type: 'hotel',
                        title: 'Check-in hotel en Cannaregio',
                        description: 'Cannaregio es el barrio más auténtico y tranquilo de Venecia, alejado del turismo masivo de San Marcos pero bien comunicado en vaporetto.',
                        image: routes.italy.itinerary.cannergio,
                    },
                    {
                        time: '16:00', type: 'activity',
                        title: 'Plaza de San Marcos',
                        description: 'Napoleón la llamó "el salón más elegante de Europa". La basílica de mosaicos dorados, el Campanile y el Palacio Ducal forman un conjunto único.',
                        image: routes.italy.itinerary.marcos,
                    },
                ]
            },
            {
                dayNumber: 7,
                title: 'Venecia canales',
                events: [
                    {
                        time: '09:00', type: 'activity',
                        title: 'Paseo en góndola',
                        description: 'Los gondoleros navegan por canales secundarios que ningún vaporetto recorre. Una hora entre palacios medievales y puentes de piedra es irrepetible.',
                        image: routes.italy.itinerary.gondola,
                    },
                    {
                        time: '12:00', type: 'food',
                        title: 'Mercado de Rialto',
                        description: 'El mercado más antiguo de Venecia lleva activo desde 1097. Pescado del Adriático, verduras de la laguna y los mejores cicchetti de la ciudad.',
                        image: routes.italy.itinerary.rialto,
                    },
                    {
                        time: '15:00', type: 'activity',
                        title: 'Isla de Murano',
                        description: 'Famosa mundialmente por su cristal soplado a mano. Puedes visitar talleres activos y ver a los maestros vidrieros trabajar con técnicas de 700 años.',
                        image: routes.italy.itinerary.murano,
                    },
                ]
            },
            {
                dayNumber: 8,
                title: 'Vuelta a casa',
                events: [
                    {
                        time: '07:00', type: 'transport',
                        title: 'Transfer al aeropuerto Marco Polo',
                        description: 'El aeropuerto de Venecia está en tierra firme. El transfer en lancha acuática es la opción más espectacular para la despedida.',
                        image: undefined,
                    },
                    {
                        time: '11:00', type: 'transport',
                        title: 'Vuelo de regreso',
                        description: 'Arrivederci, Italia. El país más bello del mundo ya espera tu próxima visita.',
                        image: undefined,
                    },
                ]
            },
        ]
    },
];