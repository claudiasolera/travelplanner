// Traductor que convierte nombres de ciudades a coordenadas de latitud y longitud para las APIs
class GeocodingService {
    async getCoords(city) {
        try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`;
            
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'MiPlataformaViajes/1.0'
                }
            });

            const data = await response.json();

            if (!data || data.length === 0) {
                throw new Error('No se encontraron coordenadas para esa ciudad');
            }

            return {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon),
                displayName: data[0].display_name
            };
        } catch (error) {
            console.error('❌ Error en Geocoding:', error.message);
            throw error;
        }
    }
}

export default new GeocodingService();