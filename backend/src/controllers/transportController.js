import transitService from '../services/transitApi.js';
import uberService from '../services/uberApi.js';
import weatherService from '../services/weatherApi.js';
import routingService from '../services/routingApi.js';
import { enrichTransportWithAI } from '../services/aiService.js';
import redisClient from '../config/redis.js';

export const getComparison = async (req, res) => {
    try {
        const {
            fromLat, fromLon, toLat, toLon,
            origin, destination,
            equipaje = 'cabina',
            horaLlegada = null
        } = req.body;

        const fromLatN = parseFloat(fromLat);
        const fromLonN = parseFloat(fromLon);
        const toLatN = parseFloat(toLat);
        const toLonN = parseFloat(toLon);

        if (isNaN(fromLatN) || isNaN(fromLonN) || isNaN(toLatN) || isNaN(toLonN)) {
            return res.status(400).json({
                status: "error",
                code: "MISSING_COORDS",
                message: "Coordenadas incompletas. Verifica que origen y destino sean válidos."
            });
        }

        if (Math.abs(fromLatN) > 90 || Math.abs(toLatN) > 90 ||
            Math.abs(fromLonN) > 180 || Math.abs(toLonN) > 180) {
            return res.status(400).json({
                status: "error",
                code: "INVALID_COORDS",
                message: "Las coordenadas proporcionadas no son válidas."
            });
        }

        const R = 6371;
        const dLat = (toLatN - fromLatN) * Math.PI / 180;
        const dLon = (toLonN - fromLonN) * Math.PI / 180;
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(fromLatN * Math.PI / 180) * Math.cos(toLatN * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
        const distanciaKm = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        if (distanciaKm < 0.5) {
            return res.status(400).json({
                status: "error",
                code: "TOO_CLOSE",
                message: "Origen y destino demasiado cerca. Usa otra opción (caminar)."
            });
        }

        if (distanciaKm > 200) {
            return res.status(400).json({
                status: "error",
                code: "TOO_FAR",
                message: `La distancia es de ${Math.round(distanciaKm)} km. Esta sección es para trayectos urbanos (máx. 200 km).`,
                distanciaKm: Math.round(distanciaKm)
            });
        }

        const cacheKey = `transport:v4:${fromLatN},${fromLonN}:${toLatN},${toLonN}:${equipaje}:${horaLlegada || 'now'}`;
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.json(JSON.parse(cached));
        }

        const [publico, clima, ruta] = await Promise.all([
            transitService.getRoute({ fromLat: fromLatN, fromLon: fromLonN }),
            weatherService.getWeather(toLatN, toLonN),
            routingService.getTravelData(fromLatN, fromLonN, toLatN, toLonN)
        ]);

        const privado = uberService.getEstimates({
            distanciaKm: ruta?.distancia || "0 km",
            tiempoMin: ruta?.duracion || "0 min"
        });

        const uberActualizado = privado.map(opcion => {
            const tiempoEspera = parseInt(opcion.tiempo) || 5;
            const tiempoTrayecto = ruta ? parseInt(ruta.duracion) : 20;
            return {
                ...opcion,
                tiempoEspera: `${tiempoEspera} min`,
                tiempoTrayecto: `${tiempoTrayecto} min`,
                tiempoTotal: `${tiempoEspera + tiempoTrayecto} min`
            };
        });

        const uberPrecio = parseFloat(uberActualizado[0]?.precio?.replace(/[^\d.]/g, '')) || 25;
        const uberDuracionMin = parseInt(uberActualizado[0]?.tiempoTotal) || 30;

        const aiEnrichment = await enrichTransportWithAI({
            origin: origin || 'origen',
            destination: destination || 'destino',
            realData: {
                distanciaKm: parseFloat(ruta?.distancia) || 0,
                duracionCocheMin: parseInt(ruta?.duracion) || 0,
                lineasTransporte: publico || [],
                clima,
                uberPrecio,
                uberDuracionMin,
                equipaje,
                horaLlegada
            }
        });

        const tiempoPublico = aiEnrichment?.publico?.tiempo_estimado_min
            || Math.round((parseInt(ruta?.duracion) || 20) * 2);

        let enlaceOficial = null;
        if (aiEnrichment?.enlace_transporte_oficial) {
            try {
                const u = new URL(aiEnrichment.enlace_transporte_oficial);
                enlaceOficial = `${u.protocol}//${u.hostname}`;
            } catch {}
        }

        const lineasReales = (publico || []).slice(0, 8);
        const lineaRecomendadaCodigo = aiEnrichment?.publico?.linea_recomendada || null;
        let lineaRecomendada = null;
        let otrasLineas = lineasReales;

        if (lineaRecomendadaCodigo && lineasReales.length > 0) {
            const encontrada = lineasReales.find(l =>
                l.linea === lineaRecomendadaCodigo ||
                l.linea?.toLowerCase() === lineaRecomendadaCodigo?.toLowerCase()
            );
            if (encontrada) {
                lineaRecomendada = encontrada;
                otrasLineas = lineasReales.filter(l => l.linea !== encontrada.linea);
            }
        }

        const precioPublico = aiEnrichment?.publico?.precio_billete || null;

        const responseData = {
            status: "success",
            data: {
                resumen: {
                    distancia: ruta?.distancia || "N/A",
                    tiempoEstimadoCoche: ruta?.duracion || "N/A"
                },
                clima,
                equipaje,
                horaLlegada,
                recomendacion: aiEnrichment?.recomendacion_principal || "Compara las opciones disponibles.",
                avisoContextual: aiEnrichment?.aviso_contextual || null,
                opciones: {
                    publico: {
                        titulo: "Transporte Público",
                        medio: lineasReales.length > 0
                            ? [...new Set(lineasReales.map(l => l.tipo))].join(' / ')
                            : "Transporte público",
                        lineaRecomendada,
                        razonRecomendada: aiEnrichment?.publico?.razon || null,
                        lineas: otrasLineas,
                        operador: lineasReales.length > 0
                            ? [...new Set(lineasReales.map(l => l.operador))].join(', ')
                            : "Consultar",
                        tiempo_min: tiempoPublico,
                        precio_eur: precioPublico,
                        precio_desconocido: precioPublico === null,
                        descripcion_corta: aiEnrichment?.publico?.consejo || "Consulta horarios en la web oficial",
                        adecuado_equipaje: equipaje !== 'pesado',
                        donde_comprar: aiEnrichment?.publico?.donde_comprar || "Consultar en la web oficial",
                        metodo_pago: aiEnrichment?.publico?.metodo_pago || "Tarjeta o efectivo",
                        enlaces: enlaceOficial
                            ? [{ label: "Horarios y rutas oficiales", url: enlaceOficial }]
                            : []
                    },
                    privado: {
                        titulo: "Taxi / VTC",
                        medio: "Taxi / Uber / Cabify",
                        lineaRecomendada: null,
                        razonRecomendada: null,
                        lineas: [],
                        operador: "Taxi / Uber / Cabify",
                        tiempo_min: uberDuracionMin,
                        precio_eur: uberPrecio,
                        precio_desconocido: false,
                        descripcion_corta: aiEnrichment?.privado?.consejo || "Trayecto directo puerta a puerta",
                        adecuado_equipaje: true,
                        donde_comprar: aiEnrichment?.privado?.donde_comprar || "App o parada de taxi",
                        metodo_pago: aiEnrichment?.privado?.metodo_pago || "Tarjeta / efectivo / app",
                        servicios_disponibles: [
                            { nombre: "Uber", tipo: "Económico", precio_aprox: `${Math.round(uberPrecio * 0.9)}€`, app: "https://www.uber.com" },
                            { nombre: "Cabify", tipo: "Equilibrado", precio_aprox: `${uberPrecio}€`, app: "https://cabify.com" },
                            { nombre: "FreeNow", tipo: "Taxi oficial", precio_aprox: `${Math.round(uberPrecio * 1.1)}€`, app: "https://free-now.com" }
                        ],
                        enlaces: [
                            { label: "Uber", url: "https://www.uber.com" },
                            { label: "Cabify", url: "https://cabify.com" },
                            { label: "FreeNow", url: "https://free-now.com" }
                        ]
                    }
                },
                iaDisponible: !!aiEnrichment
            }
        };

        await redisClient.setEx(cacheKey, 60 * 60 * 6, JSON.stringify(responseData));
        res.json(responseData);

    } catch (error) {
        console.error('❌ Error en getComparison:', error.message);
        res.status(500).json({ status: "error", code: "SERVER_ERROR", message: error.message });
    }
};