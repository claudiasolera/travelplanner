const GEOAPIFY_KEY = process.env.GEOAPIFY_API_KEY;
const BASE_URL = 'https://api.geoapify.com/v2/places';

class geoapifyService {
    async getEverything({ lat, lon }) {
        try {
            console.log('🔍 getEverything llamado con:', { lat, lon });

            const [tourism, food] = await Promise.all([
                this.fetchPlaces(lat, lon, 'tourism.sights,tourism.attraction,entertainment.museum,entertainment.culture,leisure.park', 3000, 30),
                this.fetchPlaces(lat, lon, 'catering.restaurant,catering.cafe,catering.bar', 1500, 20)
            ]);

            const places = tourism.map(p => ({
                id: p.properties.place_id,
                name: p.properties.name || 'Lugar de interés',
                type: this.mapCategory(p.properties.categories),
                description: p.properties.description || '',
                location: { lat: p.properties.lat, lon: p.properties.lon },
                opening_hours: p.properties.opening_hours || 'No disponible',
                fee: 'Consultar',
                wikipedia: p.properties.wiki ? `https://es.wikipedia.org/wiki/${p.properties.wiki}` : null
            })).filter(p => p.name !== 'Lugar de interés');

            const restaurants = food.map(p => ({
                id: p.properties.place_id,
                name: p.properties.name || 'Restaurante',
                cuisine: p.properties.catering?.cuisine
                    ? Object.keys(p.properties.catering.cuisine).map(c => c.charAt(0).toUpperCase() + c.slice(1))
                    : [this.mapFoodType(p.properties.categories)],
                address: p.properties.address_line2 || p.properties.street || 'Ver en mapa',
                location: { lat: p.properties.lat, lon: p.properties.lon },
                price: this.mapPrice(p.properties.catering?.price),
                website: p.properties.website || null
            })).filter(r => r.name !== 'Restaurante');

            console.log(`✅ Geoapify: ${places.length} lugares, ${restaurants.length} restaurantes`);
            return { places, restaurants };

        } catch (error) {
            console.error('❌ Error en getEverything:', error.message);
            return { places: [], restaurants: [] };
        }
    }

    async fetchPlaces(lat, lon, categories, radius, limit) {
        const url = `${BASE_URL}?categories=${categories}&filter=circle:${lon},${lat},${radius}&limit=${limit}&apiKey=${GEOAPIFY_KEY}`;
        const res = await fetch(url, {
            headers: { 'Accept': 'application/json' }
        });
        if (!res.ok) throw new Error(`Geoapify error: ${res.status}`);
        const data = await res.json();
        return data.features || [];
    }

    mapCategory(categories) {
        if (!categories) return 'Atracción';
        const cats = categories.join(',');
        if (cats.includes('museum')) return 'museum';
        if (cats.includes('park') || cats.includes('garden')) return 'park';
        if (cats.includes('monument') || cats.includes('memorial')) return 'monument';
        if (cats.includes('church') || cats.includes('place_of_worship')) return 'monument';
        if (cats.includes('viewpoint')) return 'viewpoint';
        return 'attraction';
    }

    mapFoodType(categories) {
        if (!categories) return 'Varios';
        const cats = categories.join(',');
        if (cats.includes('cafe')) return 'Café';
        if (cats.includes('bar')) return 'Bar';
        return 'Varios';
    }

    mapPrice(price) {
        if (!price) return 'Consultar';
        if (price === 'cheap') return 'Económico';
        if (price === 'moderate') return 'Moderado';
        if (price === 'expensive') return 'Caro';
        if (price === 'very_expensive') return 'Lujo';
        return 'Consultar';
    }

    async getRestaurants({ lat, lon }) {
        const { restaurants } = await this.getEverything({ lat, lon });
        return restaurants;
    }

    async getTouristPoints({ lat, lon }) {
        const { places } = await this.getEverything({ lat, lon });
        return places;
    }
}

export default new geoapifyService();