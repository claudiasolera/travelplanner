
class AmadeusService {
    constructor() {
        this.apiKey = process.env.AMADEUS_API_KEY;
        this.apiSecret = process.env.AMADEUS_API_SECRET;
        this.baseURL = 'https://test.api.amadeus.com';
        this.accessToken = null;
        this.tokenExpiry = null;
    }

    async getIataCode(cityName) {
        try {
            if (!cityName) return null;
            const cleanName = cityName.split(',')[0].trim().toUpperCase();
            
            if (cleanName.length === 3) return cleanName;

            const token = await this.getAccessToken();
            
            const response = await fetch(
                `${this.baseURL}/v1/reference-data/locations?subType=CITY,AIRPORT&keyword=${cleanName}&page[limit]=5`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            const data = await response.json();
            
            const manualCodes = {
                'LONDRES': 'LON', 'LONDON': 'LON', 'GRAN LONDRES': 'LON',
                'KIOTO': 'UKY', 'KYOTO': 'UKY',
                'TOKIO': 'TYO', 'TOKYO': 'TYO',
                'OSAKA': 'OSA',
                'NUEVA YORK': 'NYC', 'NEW YORK': 'NYC',
                'PARIS': 'PAR', 'PARÍS': 'PAR',
                'ROMA': 'FCO',
                'ROME': 'FCO',
                'MILAN': 'MIL', 'MILÁN': 'MIL', 'MILANO': 'MIL',
                'BERLIN': 'BER', 'BERLÍN': 'BER',
                'AMSTERDAM': 'AMS',
                'BRUSELAS': 'BRU', 'BRUSSELS': 'BRU',
                'LISBOA': 'LIS', 'LISBON': 'LIS',
                'TOKIO': 'TYO', 'TOKYO': 'TYO',
                'DUBAI': 'DXB',
                'NUEVA DELHI': 'DEL', 'NEW DELHI': 'DEL',
                'PEKIN': 'BJS', 'BEIJING': 'BJS',
                'SYDNEY': 'SYD',
                'TORONTO': 'YTO',
                'CHICAGO': 'CHI',
                'LOS ANGELES': 'LAX',
                'MIAMI': 'MIA',
                'BARCELONA': 'BCN',
                'MADRID': 'MAD',
                'SEVILLA': 'SVQ',
                'VALENCIA': 'VLC',
                'MALAGA': 'AGP', 'MÁLAGA': 'AGP',
                'TENERIFE': 'TCI',
                'GRAN CANARIA': 'LPA',
                'IBIZA': 'IBZ',
                'PALMA': 'PMI',
                'MENORCA': 'MAH'
            };

            if (!data.data || data.data.length === 0) {
                return manualCodes[cleanName] || null; 
            }

            const city = data.data.find(loc => loc.subType === 'CITY');
            const location = city || data.data.find(loc => loc.iataCode);
            return location ? location.iataCode : manualCodes[cleanName] || null;
        } catch (error) {
            return null;
        }
    }

    async getAccessToken() {
        try {

            if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
                return this.accessToken;
            }
            const response = await fetch(
                `${this.baseURL}/v1/security/oauth2/token`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        grant_type: 'client_credentials',
                        client_id: this.apiKey,
                        client_secret: this.apiSecret
                    }).toString()
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('❌ Error al obtener token:', errorData);
                throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();

            this.accessToken = data.access_token;
            this.tokenExpiry = Date.now() + (data.expires_in * 1000);

            console.log('✅Token de Amadeus obtenido correctamente')
            return this.accessToken;
        } catch (error) {
            console.error('❌Error al obtener token de Amadeus:', error.message);
            res.status(500).json({ 
                error: 'Error al autenticar con Amadeus',
                message: error.message
            });
        }
    }

    async searchFlights({ origin, destination, departureDate, adults = 1, returnDate = null, travelClass = null }) {
        try {
            const from = await this.getIataCode(origin);
            const to = await this.getIataCode(destination);

            if (!from || !to) throw new Error('No se encontró el código de ciudad');

            const token = await this.getAccessToken();

            const params = new URLSearchParams({
                originLocationCode: from,
                destinationLocationCode: to,
                departureDate,
                adults,
                max: 10
            });

            if (travelClass) {
                params.append('travelClass', travelClass);
            }

            if (returnDate) {
                params.append('returnDate', returnDate);
            }

            console.log(`🔍 Buscando vuelos: ${origin} -> ${destination} (${departureDate})`);

            const fullUrl = `${this.baseURL}/v2/shopping/flight-offers?${params}`;

            const response = await fetch(
                fullUrl,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('❌ Error API Amadeus (Vuelos):', errorData);
                throw new Error('Error al obtener ofertas de vuelos');
            }

            const data = await response.json();
            
            if (!data.data || data.data.length === 0) {
                console.log('⚠️ No se encontraron vuelos para esta búsqueda');
                return [];
            }

            console.log(`✅ Se encontraron ${data.data.length} vuelos`);

            const originName = await this.getCityName(from);
            const destName = await this.getCityName(to);

            return this.formatFlightResults(data.data, returnDate, originName, destName, adults, travelClass);

        } catch (error) {
            console.error('❌ Error en AmadeusService.searchFlights:', error.message);
            throw error; 
        }
    }

    async getCityName(iataCode) {
        try {
            const token = await this.getAccessToken();
            const response = await fetch(
                `${this.baseURL}/v1/reference-data/locations?subType=CITY,AIRPORT&keyword=${iataCode}&page[limit]=1`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            const data = await response.json();
            if (data.data && data.data.length > 0) {
                return data.data[0].address?.cityName || iataCode;
            }
            return iataCode;
        } catch {
            return iataCode;
        }
    }

    formatFlightResults(data, returnDate = null, originName = null, destName = null, adults = 1, travelClass = null) {
        if (!data || !Array.isArray(data)) return [];

        return data.map(offer => {
        const firstSegment = offer.itineraries[0].segments[0];
        const lastSegment = offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1];

        return {
            id: offer.id,
            price: {
                amount: parseFloat(offer.price.total),
                currency: offer.price.currency
            },
            airline: firstSegment.carrierCode,
            departure: {
                airport: firstSegment.departure.iataCode,
                cityName: originName || firstSegment.departure.iataCode,
                time: firstSegment.departure.at
            },
            arrival: {
                airport: lastSegment.arrival.iataCode,
                cityName: destName || lastSegment.arrival.iataCode,
                time: lastSegment.arrival.at
            },
            duration: offer.itineraries[0].duration,
            stops: offer.itineraries[0].segments.length - 1,
            bookingLink: (() => {
                const from = firstSegment.departure.iataCode;
                const to = lastSegment.arrival.iataCode;
                const dep = firstSegment.departure.at.split('T')[0];
                const classMap = {
                    'ECONOMY': 'e',
                    'PREMIUM_ECONOMY': 'p',
                    'BUSINESS': 'b',
                    'FIRST': 'f'
                };
                const cabinParam = classMap[travelClass] || 'e';
                const adultsParam = adults || 1;
                if (returnDate) {
                    return `https://www.google.com/travel/flights?q=flights+${from}+to+${to}&tfs=CBwQAhoeEgoyMDI2LTA2LTAxagcIARID${from}cgcIARID${to}&hl=es&curr=EUR&cabin=${cabinParam}&adults=${adultsParam}&return=${returnDate}`;
                }
                return `https://www.google.com/travel/flights?q=flights+${from}+to+${to}&hl=es&curr=EUR&cabin=${cabinParam}&adults=${adultsParam}&dep=${dep}&oneway=1`;
            })()
            };
        });
    }

    async searchHotels({ cityCode, checkInDate, checkOutDate, adults = 1 }) {
        try {
            const token = await this.getAccessToken();

            const listRes = await fetch(
                `${this.baseURL}/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            const listData = await listRes.json();
            if (!listData.data) return [];

            const hotelIds = listData.data.slice(0, 10).map(h => h.hotelId).join(',');

            const offersRes = await fetch(
                `${this.baseURL}/v3/shopping/hotel-offers?hotelIds=${hotelIds}&adults=${adults}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&bestRateOnly=true`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            const offersData = await offersRes.json();

            return listData.data.slice(0, 10).map(hotelBase => {
                const offerMatch = offersData.data?.find(o => o.hotel.hotelId === hotelBase.hotelId);
                
                return {
                    hotelId: hotelBase.hotelId,
                    name: hotelBase.name,
                    rating: hotelBase.rating || '3', 
                    price: {
                        amount: offerMatch ? parseFloat(offerMatch.offers[0].price.total) : null,
                        currency: offerMatch ? offerMatch.offers[0].price.currency : 'EUR',
                        note: offerMatch ? "Precio Final" : "Consultar Disponibilidad"
                    },
                    address: {
                        fullAddress: (hotelBase.address?.lines) 
                            ? hotelBase.address.lines.join(', ') 
                            : `Área de ${hotelBase.address?.cityName || cityCode}`,
                        cityName: hotelBase.address?.cityName || cityCode,
                        postalCode: hotelBase.address?.postalCode || ''
                    },
                    location: {
                        lat: hotelBase.geoCode?.latitude || null,
                        lon: hotelBase.geoCode?.longitude || null
                    },
                    bookingLink: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotelBase.name)}`
                };
            });

        } catch (error) {
            console.error("Error consolidando info de hoteles:", error);
            return [];
        }
    }

    formatHotelResults(data) {
        return data.map(item => {
            const hotel = item.hotel;
            const offer = item.offers?.[0];
            
            return {
                hotelId: hotel.hotelId,
                name: hotel.name,
                rating: hotel.rating || '3',
                address: {
                    fullAddress: hotel.address?.lines ? hotel.address.lines.join(', ') : 'Calle no disponible',
                    cityName: hotel.address?.cityName || '',
                    postalCode: hotel.address?.postalCode || ''
                },
                location: {
                    lat: hotel.geoCode?.latitude,
                    lon: hotel.geoCode?.longitude
                },
                price: {
                    amount: offer ? parseFloat(offer.price.total) : null,
                    currency: offer ? offer.price.currency : 'EUR'
                },
                bookingLink: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotel.name)}`
            };
        });
    }

    formatHotelListResults(data) {
        return data.map(hotel => ({
            hotelId: hotel.hotelId,
            name: hotel.name,
            rating: 'N/A',
            price: {
                amount: null,
                currency: 'EUR',
                note: "Consultar precio"
            },
            address: { cityName: hotel.address?.cityName || 'N/A' },
            bookingLink: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotel.name)}`
        }));
    }

    async searchPlaces({ lat, lon }) {
        try {
            const token = await this.getAccessToken();
            
            const url = `${this.baseURL}/v1/shopping/activities?latitude=${lat}&longitude=${lon}&radius=5`;

            console.log('📡 Llamando a Amadeus Activities...');
            
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('❌ Detalle error Amadeus Activities:', errorData);
                throw new Error(`Amadeus API Error: ${response.status}`);
            }

            const data = await response.json();
            
            return this.formatActivityResults(data.data);
        } catch (error) {
            console.error('❌ Error en searchPlaces:', error.message);
            return [];
        }
    }
    formatActivityResults(data) {
        if (!data || !Array.isArray(data)) return [];
        return data.map(act => ({
            id: act.id,
            name: act.name,
            category: 'Actividad / Punto Turístico',
            rating: act.rating || 'N/A',
            description: act.shortDescription || 'Sin descripción disponible.',
            location: {
                lat: act.geoCode?.latitude,
                lon: act.geoCode?.longitude
            },
            price: act.price ? {
                amount: act.price.amount,
                currency: act.price.currencyCode
            } : null,
            photos: act.pictures && act.pictures.length > 0 ? [act.pictures[0]] : [],
            bookingLink: act.bookingLink
        }));
    }
    
}

export default new AmadeusService();