import redisClient from '../config/redis.js';
import amadeusService from '../services/amadeusApi.js';
import geocodingService from '../services/geocodingService.js';
import geoapifyService from '../services/geoapifyApi.js';
import transitService from '../services/transitApi.js';
import uberService from '../services/uberApi.js';
import duffelService from '../services/duffelApi.js';
import liteApiService from '../services/liteApi.js';
import { getDiscoverRecommendations } from '../services/aiService.js';

export const searchFlights = async (req, res) => {
    try {
        const { origin, destination, departureDate, returnDate, adults, travelClass } = req.body;

        if (!origin || !destination || !departureDate) {
            return res.status(400).json({ error: 'Faltan campos: origen, destino y fecha son obligatorios' });
        }

        if (origin.trim().toLowerCase() === destination.trim().toLowerCase()) {
            return res.status(400).json({ error: 'El origen y el destino no pueden ser el mismo lugar' });
        }

        const cacheKey = `flights:${origin}:${destination}:${departureDate}:${adults || 1}`;
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) return res.json(JSON.parse(cachedData));

        const flights = await duffelService.searchFlights({
            origin,
            destination,
            departureDate,
            returnDate,
            adults,
            cabinClass: travelClass
        });

        const response = { flights, total: flights.length };
        if (flights.length > 0) {
            await redisClient.setEx(cacheKey, 1800, JSON.stringify(response));
        }

        return res.json(response);

    } catch (error) {
        console.error('❌ Error en Controlador:', error.message);
        res.status(500).json({ error: 'Error interno al buscar vuelos', message: error.message });
    }
};

export const searchAirports = async (req, res) => {
    try {
        const { q, onlyAirports } = req.query;
        if (!q || q.length < 2) return res.json([]);
        const places = await duffelService.searchPlaces(q, onlyAirports === 'true');
        res.json(places);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar aeropuertos' });
    }
};

export const searchHotels = async (req, res) => {
    try {
        const { city, checkInDate, checkOutDate, adults } = req.body;

        if (!city || !checkInDate || !checkOutDate) {
            return res.status(400).json({ error: 'Se requiere ciudad, fecha de entrada y salida' });
        }

        const cleanCity = city.split(',')[0].trim();

        const coords = await geocodingService.getCoords(cleanCity);
        if (!coords?.lat || !coords?.lon) {
            return res.status(400).json({ error: `No se encontraron coordenadas para: ${city}` });
        }

        const cacheKey = `hotels:${coords.lat.toFixed(3)},${coords.lon.toFixed(3)}:${checkInDate}:${checkOutDate}:${adults || 1}`;
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            console.log('✅ Hoteles desde caché');
            return res.json(JSON.parse(cachedData));
        }

        const hotels = await liteApiService.searchHotels({
            lat: coords.lat,
            lon: coords.lon,
            checkInDate,
            checkOutDate,
            adults: adults || 1
        }) || [];

        const response = { hotels, total: hotels.length };
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(response));

        res.json(response);

    } catch (error) {
        console.error('❌ Error al buscar hoteles:', error.message);
        res.status(500).json({ error: 'Error al buscar hoteles' });
    }
};

export const searchActivities = async (req, res) => {
    try {
        let { city, lat, lon } = req.body;

        if (city && (!lat || !lon)) {
            console.log(`🌍 Buscando coordenadas para: ${city}`);
            const coords = await geocodingService.getCoords(city);
            lat = coords.lat;
            lon = coords.lon;
        }

        if (!lat || !lon) {
            return res.status(400).json({ 
                error: 'Se requiere el nombre de una ciudad o coordenadas (lat/lon)' 
            });
        }

        const cacheKey = `places:${lat.toFixed(3)},${lon.toFixed(3)}`;
        let places = [];

        const cached = await redisClient.get(cacheKey);

        if (cached) {
            console.log('📦 DATOS RECUPERADOS DE REDIS (CACHÉ)');
            const parsedData = JSON.parse(cached);
            places = parsedData.places;
        } else {
            console.log('📡 LLAMANDO A API AMADEUS (DATOS NUEVOS)');
            places = await amadeusService.searchPlaces({ lat, lon });

            if (places.length > 0) {
                await redisClient.setEx(cacheKey, 86400, JSON.stringify({ 
                    city: city || 'Coordenadas', 
                    places 
                }));
            }
        }

        if (places && places.length > 0) {
            console.table(places.slice(0, 15).map(p => ({
                Nombre: p.name ? p.name.substring(0, 35) : 'Sin nombre',
                Precio: p.price ? `${p.price.amount} ${p.price.currency}` : 'Consultar'
            })));
            if (places.length > 15) console.log(`... y ${places.length - 15} resultados más.`);
        } else {
            console.log("⚠️ No se encontraron actividades en esta zona.");
        }
        res.json({
            city: city || "Coordenadas",
            coords: { lat, lon },
            total: places.length,
            places
        });

    } catch (error) {
        console.error("❌ ERROR EN SEARCH_PLACES_CONTROLLER:", error.message);
        res.status(500).json({ 
            error: 'Error interno al buscar lugares',
            details: error.message 
        });
    }
};

export const searchPlaces = async (req, res) => {
    try {
        let { city, lat, lon } = req.body;

        if (city && (!lat || !lon)) {
            console.log(`🌍 Buscando coordenadas para: ${city}`);
            const coords = await geocodingService.getCoords(city);
            lat = coords.lat;
            lon = coords.lon;
        }

        if (!lat || !lon) {
            return res.status(400).json({ error: 'Se requiere ciudad o coordenadas' });
        }

        const cacheKey = `pois:${lat.toFixed(3)},${lon.toFixed(3)}`;
        const cached = await redisClient.get(cacheKey);
        
        let places;
        if (cached) {
            console.log('📦 DATOS RECUPERADOS DE REDIS (CACHÉ)');
            places = JSON.parse(cached).places;
        } else {
            console.log('📡 LLAMANDO A GEOAPIFY API (MONUMENTOS)');
            places = await geoapifyService.getTouristPoints({ lat, lon });
            if (places.length > 0) {
                await redisClient.setEx(cacheKey, 86400, JSON.stringify({ city, places }));
            }
        }

        if (places && places.length > 0) {
            console.table(places.slice(0, 15).map(p => ({
                Nombre: p.name.substring(0, 40),
                Tipo: p.type,
                Entrada: p.fee
            })));
            if (places.length > 15) console.log(`... y ${places.length - 15} lugares más.`);
        } else {
            console.log("⚠️ No se encontraron monumentos en esta zona.");
        }

        res.json({ city, total: places.length, places });

    } catch (error) {
        console.error("❌ ERROR EN SEARCH_PLACES:", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const searchRestaurants = async (req, res) => {
    try {
        const { lat, lon } = req.body;
        
        const restaurants = await geoapifyService.getRestaurants({ lat, lon });

        console.log(`🍴 Restaurantes reales encontrados: ${restaurants.length}`);
        console.table(restaurants.slice(0, 10).map(r => ({
            Nombre: r.name,
            Cocina: r.cuisine
        })));

        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const searchEverything = async (req, res) => {
    try {
        let { city, lat, lon } = req.body;

        if (city && (!lat || !lon)) {
            const coords = await geocodingService.getCoords(city);
            lat = coords.lat;
            lon = coords.lon;
        }

        if (!lat || !lon) {
            return res.status(400).json({ error: 'Se requiere ciudad o coordenadas' });
        }

        const cacheKey = `everything:${parseFloat(lat).toFixed(3)},${parseFloat(lon).toFixed(3)}`;
        const cached = await redisClient.get(cacheKey);
        if (cached) return res.json(JSON.parse(cached));

        const { places, restaurants } = await geoapifyService.getEverything({ lat, lon });

        const response = {
            coords: { lat, lon },
            places,
            restaurants,
        };

        if (places.length > 0 || restaurants.length > 0) {
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(response));
        }

        res.json(response);

    } catch (error) {
        console.error('❌ ERROR EN searchEverything:', error.message);
        res.status(500).json({ error: error.message });
    }
};

export const getDiscoverData = async (req, res) => {
    try {
        let { city, country, startDate, endDate, lat, lon } = req.body;

        if (!city) return res.status(400).json({ error: 'Ciudad requerida' });

        if (!lat || !lon) {
            const coords = await geocodingService.getCoords(city.split(',')[0].trim());
            if (!coords) return res.status(400).json({ error: 'No se encontraron coordenadas' });
            lat = coords.lat;
            lon = coords.lon;
        }

        const cacheKey = `discover:${city.toLowerCase()}:${startDate || 'none'}:${endDate || 'none'}`;
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            console.log('📦 Discover desde caché');
            return res.json(JSON.parse(cached));
        }

        const { places, restaurants } = await geoapifyService.getEverything({ lat, lon });

        let aiData = null;
        try {
            aiData = await getDiscoverRecommendations({
                city: city.split(',')[0].trim(),
                country: country || '',
                startDate,
                endDate,
                places,
                restaurants
            });
        } catch (e) {
            console.error('⚠️ IA no disponible para discover:', e.message);
        }

        const restaurantsWithTags = restaurants.map(r => ({
            ...r,
            etiquetas: aiData?.etiquetas_restaurantes?.[r.name] || []
        }));

        const response = {
            coords: { lat, lon },
            places,
            restaurants: restaurantsWithTags,
            eventos: aiData?.eventos || [],
            tours: aiData?.tours_sugeridos || [],
            faq: aiData?.preguntas_frecuentes || [],
            iaDisponible: !!aiData
        };

        await redisClient.setEx(cacheKey, 60 * 60 * 12, JSON.stringify(response));
        res.json(response);

    } catch (error) {
        console.error('❌ Error en getDiscoverData:', error.message);
        res.status(500).json({ error: 'Error al obtener datos de exploración' });
    }
};