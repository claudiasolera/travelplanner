const OLLAMA_URL = 'https://jarvis.ieshlanz.es';
const MODEL = 'qwen2.5:7b-instruct';

const TRUSTED_DOMAINS = [
    'tmb.cat', 'renfe.com', 'emtmadrid.es', 'metromadrid.es', 'crtm.es',
    'atm.cat', 'rodalies.gencat.cat', 'aena.es', 'mbta.com', 'mta.info',
    'tfl.gov.uk', 'ratp.fr', 'sncf-connect.com', 'trenitalia.com',
    'deutschebahn.com', 'bahn.de', 'bvg.de', 'wienerlinien.at',
    'uber.com', 'cabify.com', 'free-now.com', 'bolt.eu', 'mytaxi.com',
    'aerobusbcn.com', 'emt.es'
];

const askOllama = async (prompt) => {
    try {
        const res = await fetch(`${OLLAMA_URL}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.JARVIS_API_KEY}`
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.5,
                max_tokens: 4000
            })
        });
        if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
        const data = await res.json();
        return data.choices?.[0]?.message?.content || '';
    } catch (error) {
        console.error('❌ Error Ollama:', error.message);
        return null;
    }
};

const parseJSON = (text) => {
    try {
        const clean = text.replace(/```json|```/g, '').trim();
        const start = clean.indexOf('{');
        const end = clean.lastIndexOf('}');
        if (start === -1 || end === -1) return null;
        return JSON.parse(clean.substring(start, end + 1));
    } catch { return null; }
};

const sanitizeUrl = (url) => {
    try {
        const u = new URL(url);
        const host = u.hostname.replace(/^www\./, '');
        const isValid = TRUSTED_DOMAINS.some(d => host === d || host.endsWith('.' + d));
        return isValid ? `${u.protocol}//${u.hostname}` : null;
    } catch { return null; }
};

const sanitizeEnlaces = (enlaces) => {
    if (!Array.isArray(enlaces)) return [];
    return enlaces
        .map(e => ({ label: e.label, url: sanitizeUrl(e.url) }))
        .filter(e => e.url);
};

export const getDestinationInfo = async (destination, country) => {
    const cityName = destination.split(',')[0].trim();
    const countryName = country || destination.split(',').pop()?.trim() || cityName;

    console.log(`🌍 Generando info con IA para: ${cityName}, ${countryName}`);

    const prompt = `Eres un experto en viajes y cultura mundial. Genera una guía de viaje completa y detallada para ${cityName}, ${countryName}.

Responde ÚNICAMENTE con un objeto JSON válido con esta estructura exacta, sin texto antes ni después, sin markdown:
{
    "bandera": "emoji de la bandera del país",
    "historia": "Párrafo de 3-4 frases sobre la historia específica de ${cityName}",
    "curiosidades": [
        "Curiosidad específica 1 sobre ${cityName}",
        "Curiosidad específica 2",
        "Curiosidad específica 3",
        "Curiosidad específica 4",
        "Curiosidad específica 5"
    ],
    "costumbres": [
        "Costumbre o tradición específica 1 de ${cityName} o ${countryName}",
        "Costumbre específica 2",
        "Costumbre específica 3",
        "Costumbre específica 4"
    ],
    "leyendas": [
        "Leyenda o mito específico de ${cityName} o ${countryName} - primera leyenda detallada",
        "Segunda leyenda o historia popular de la zona"
    ],
    "gastronomia": [
        "Plato típico 1: descripción breve",
        "Plato típico 2: descripción breve",
        "Bebida o postre típico: descripción breve"
    ],
    "mejor_epoca": "Descripción específica de cuándo es mejor visitar ${cityName} y por qué",
    "transporte_local": "Descripción del transporte público en ${cityName}",
    "propinas": "Costumbre de propinas en ${countryName}",
    "seguridad": "Nivel de seguridad general en ${cityName} y consejos específicos",
    "idioma": "Idioma o idiomas oficiales de ${countryName}",
    "moneda_nombre": "Nombre de la moneda oficial de ${countryName}",
    "moneda_simbolo": "Símbolo de la moneda",
    "moneda_codigo": "Código ISO de la moneda (ej: EUR, USD, JPY)",
    "enchufe": "Tipo de enchufe usado en ${countryName}",
    "voltaje": "Voltaje y frecuencia eléctrica en ${countryName}",
    "vacunas_recomendadas": [
        "Vacuna recomendada 1",
        "Vacuna recomendada 2"
    ],
    "vacunas_obligatorias": "Vacunas obligatorias para entrar al país o 'Ninguna para ciudadanos españoles'",
    "visado": "Requisitos de visado para ciudadanos españoles en ${countryName}",
    "capital": "Capital del país ${countryName}",
    "poblacion": "Población aproximada de ${countryName}",
    "region": "Región o continente donde se encuentra ${countryName}"
}`;

    console.log('🤖 Consultando Ollama...');
    const ollamaResponse = await askOllama(prompt);
    const aiData = ollamaResponse ? parseJSON(ollamaResponse) : null;

    if (aiData) {
        console.log('✅ Datos de Ollama obtenidos correctamente');
    } else {
        console.error('❌ Ollama no respondió o devolvió JSON inválido');
        return null;
    }

    return {
        ciudad: cityName,
        pais: countryName,
        bandera: aiData.bandera || '',
        wikipedia_url: null,

        historia: aiData.historia || `${cityName} es un destino fascinante con una rica historia y cultura.`,

        curiosidades: aiData.curiosidades || [
            `${cityName} es un destino único lleno de sorpresas.`
        ],

        costumbres: aiData.costumbres || [
            `Al visitar ${cityName} es importante respetar las costumbres locales.`
        ],

        leyendas: aiData.leyendas || [
            `${cityName} guarda numerosas historias y leyendas transmitidas de generación en generación.`
        ],

        gastronomia: aiData.gastronomia || [
            `${cityName} ofrece una gastronomía local rica y variada.`
        ],

        documentos: {
            visado: aiData.visado || `Consulta el portal del Ministerio de Asuntos Exteriores para los requisitos de visado para ${countryName}.`,
            pasaporte: 'El pasaporte debe estar vigente con al menos 6 meses de validez más allá de la fecha de regreso.',
            otros: [
                'Seguro de viaje (muy recomendable)',
                'Carné de conducir internacional si planeas alquilar vehículo',
                'Tarjeta sanitaria europea (si aplica)',
                'Reservas de hotel y vuelos impresas o en el móvil'
            ]
        },

        moneda: {
            nombre: aiData.moneda_nombre || 'Consultar',
            simbolo: aiData.moneda_simbolo || '?',
            codigo: aiData.moneda_codigo || 'Consultar',
            cambio_aproximado: `Consulta el tipo de cambio actualizado EUR/${aiData.moneda_codigo || '?'} antes de viajar`,
            consejos: [
                'Avisa a tu banco antes de viajar para evitar bloqueos de tarjeta',
                'Lleva algo de efectivo para pequeños comercios y propinas',
                'Evita cambiar dinero en aeropuertos — las comisiones son más altas',
                'Las tarjetas de crédito/débito son ampliamente aceptadas en zonas turísticas'
            ]
        },

        vacunas: {
            recomendadas: aiData.vacunas_recomendadas || ['Tétanos-difteria (al día)', 'Hepatitis A y B'],
            obligatorias: [aiData.vacunas_obligatorias || 'Ninguna para ciudadanos españoles en la mayoría de destinos — consultar'],
            consejo: `Visita el Centro de Vacunación Internacional al menos 4-6 semanas antes del viaje para asesoramiento personalizado sobre ${cityName}.`
        },

        datos_practicos: {
            idioma: aiData.idioma || 'Consultar',
            otros_idiomas: [],
            enchufe: aiData.enchufe || 'Consultar antes de viajar',
            voltaje: aiData.voltaje || 'Consultar',
            propinas: aiData.propinas || 'Consultar costumbres locales',
            seguridad: aiData.seguridad || `Consulta las recomendaciones del Ministerio de Asuntos Exteriores de España`,
            mejor_epoca: aiData.mejor_epoca || `Consulta el clima de ${cityName} según la época del año`,
            transporte_local: aiData.transporte_local || `${cityName} cuenta con diversos medios de transporte público`,
            capital: aiData.capital || 'Consultar',
            poblacion: aiData.poblacion || 'Consultar',
            region: aiData.region || 'Consultar'
        }
    };
};


export const enrichTransportWithAI = async ({ origin, destination, realData }) => {
    const {
        distanciaKm,
        duracionCocheMin,
        lineasTransporte,
        clima,
        uberPrecio,
        uberDuracionMin,
        equipaje,
        horaLlegada
    } = realData;

    const horaStr = horaLlegada ? new Date(horaLlegada).getHours() : null;
    const esNoche = horaStr !== null && (horaStr >= 22 || horaStr < 6);

    const equipajeDesc = {
        mochila: 'Solo mochila ligera',
        cabina: 'Maleta de cabina',
        pesado: 'Equipaje pesado (maleta grande)'
    }[equipaje] || 'Equipaje estándar';

    const hayLineas = lineasTransporte.length > 0;
    const tipoTransporte = hayLineas
        ? [...new Set(lineasTransporte.map(l => l.tipo))].join(' / ')
        : 'transporte público';
    const operadores = hayLineas
        ? [...new Set(lineasTransporte.map(l => l.operador))].join(', ')
        : 'desconocido';

    const lineasListado = hayLineas
        ? lineasTransporte.slice(0, 15).map(l => `${l.tipo} "${l.linea}" (${l.operador})`).join(', ')
        : 'ninguna detectada';

    const prompt = `Eres un experto en transporte urbano. Genera información práctica para un viaje de ${origin} a ${destination}.

DATOS:
- Distancia: ${distanciaKm} km
- Tiempo coche: ${duracionCocheMin} min
- Clima: ${clima?.descripcion || '?'} (${clima?.temperatura || '?'}°C)
- Equipaje: ${equipajeDesc}
- Hora: ${horaLlegada ? `${horaStr}:00h ${esNoche ? '(NOCHE)' : ''}` : 'no especificada'}
- Transporte público disponible: ${hayLineas ? 'Sí' : 'No detectado'}
- Tipos: ${tipoTransporte}
- Operadores: ${operadores}
- Líneas detectadas cerca del origen: ${lineasListado}
- Precio Uber estimado: ${uberPrecio}€

INSTRUCCIONES:
- De las líneas detectadas, elige cuál es la MEJOR para ir de ${origin} a ${destination}.
- Indica el código/número exacto de esa línea tal como aparece en la lista (ej: si dice Autobús "46" pon "46").
- Si ninguna línea de la lista sirve para este trayecto, pon linea_recomendada como null.
- Estima el precio del billete sencillo en esa ciudad si lo conoces. Si no, pon precio_billete como null.

Responde SOLO con JSON válido:
{
    "recomendacion_principal": "1-2 frases recomendando la mejor opción según equipaje, clima y hora",
    "aviso_contextual": "Aviso importante o null",
    "publico": {
        "linea_recomendada": "El código de la línea de la lista que mejor conecta origen y destino, o null",
        "tipo_recomendado": "Autobús / Metro / Tren / Tranvía según la línea elegida",
        "razon": "Por qué recomiendas esta línea en 1 frase",
        "tiempo_estimado_min": numero,
        "precio_billete": numero o null,
        "donde_comprar": "Dónde comprar billetes en ${destination}",
        "metodo_pago": "Métodos de pago aceptados",
        "consejo": "Consejo práctico específico para esta ruta"
    },
    "privado": {
        "donde_comprar": "Desde la app o parada de taxi",
        "metodo_pago": "Tarjeta / efectivo / app",
        "consejo": "Consejo sobre taxi/VTC en ${destination}"
    },
    "enlace_transporte_oficial": "URL raíz oficial del operador de transporte de ${destination} (tmb.cat, emtmadrid.es, crtm.es, tfl.gov.uk, ratp.fr, transportesmetropolitanos.es, alsa.es, ctmam.es, etc) o null si no la conoces"
}`;

    const response = await askOllama(prompt);
    return parseJSON(response);
};

export const getPublicTransportOptions = async (origin, destination) => {
    return enrichTransportWithAI({
        origin, destination,
        realData: {
            distanciaKm: 0, duracionCocheMin: 0,
            lineasTransporte: [], clima: null,
            uberPrecio: 0, uberDuracionMin: 0,
            equipaje: 'cabina', horaLlegada: null
        }
    });
};

export const getTransportComparison = getPublicTransportOptions;

export const getDiscoverRecommendations = async ({ city, country, startDate, endDate, places, restaurants }) => {
    const placesStr = places.slice(0, 10).map(p =>
        `- ${p.name} (${p.type}) — ${p.opening_hours}`
    ).join('\n');

    const restStr = restaurants.slice(0, 10).map(r =>
        `- ${r.name} — Cocina: ${r.cuisine?.join(', ') || '?'} — Precio: ${r.price} — Web: ${r.website || 'no tiene'}`
    ).join('\n');

    const prompt = `Eres un guía turístico experto en ${city}, ${country}. Genera recomendaciones basándote en los DATOS REALES de lugares y restaurantes que te doy.

DATOS REALES DE LUGARES EN ${city} (de OpenStreetMap):
${placesStr || 'No se encontraron lugares'}

DATOS REALES DE RESTAURANTES EN ${city} (de OpenStreetMap):
${restStr || 'No se encontraron restaurantes'}

FECHAS DEL VIAJE: ${startDate || '?'} al ${endDate || '?'}

INSTRUCCIONES:
1. Para etiquetas de restaurantes, SOLO ponlas si puedes deducirlas de los datos reales (tipo de cocina, precio). Si no tienes datos suficientes, pon etiqueta como "Restaurante local" o "Cocina variada".
2. Para eventos, incluye SOLO fiestas, festivales o eventos que REALMENTE se celebran en ${city} durante esas fechas o cerca. Si no hay ninguno conocido, pon eventos como array vacío [].
3. Para preguntas frecuentes, genera preguntas REALES y útiles sobre ${city} con respuestas prácticas y verídicas.
4. Para tours, sugiere recorridos basándote en los lugares reales de la lista. No inventes lugares que no estén en los datos.

Responde SOLO con JSON válido:
{
    "etiquetas_restaurantes": {
        "NOMBRE_EXACTO_DEL_RESTAURANTE": ["etiqueta1", "etiqueta2"],
        "OTRO_RESTAURANTE": ["etiqueta1"]
    },
    "eventos": [
        {
            "nombre": "Nombre real del evento/festival",
            "descripcion": "Descripción breve",
            "fechas": "Fechas concretas (ej: 15-19 marzo)",
            "tipo": "festival / fiesta / mercado / deporte / cultural",
            "ubicacion": "Lugar donde se celebra"
        }
    ],
    "tours_sugeridos": [
        {
            "nombre": "Nombre del tour/recorrido",
            "descripcion": "Qué incluye en 1-2 frases",
            "duracion": "2-3 horas",
            "lugares": ["Nombre lugar 1 de la lista", "Nombre lugar 2"],
            "tipo": "cultural / gastronómico / histórico / nocturno"
        }
    ],
    "preguntas_frecuentes": [
        {
            "pregunta": "Pregunta real y útil sobre ${city}",
            "respuesta": "Respuesta práctica, concreta y verídica"
        }
    ]
}

REGLAS:
- En etiquetas_restaurantes usa los nombres EXACTOS de los restaurantes de la lista.
- En tours_sugeridos usa los nombres EXACTOS de los lugares de la lista.
- En eventos, si no hay eventos reales durante esas fechas, devuelve [].
- Las preguntas deben ser específicas de ${city}, no genéricas.
- Genera 4-6 preguntas frecuentes.
- Genera 2-4 tours sugeridos.
- NUNCA inventes eventos que no existan.`;

    const response = await askOllama(prompt);
    return parseJSON(response);
};