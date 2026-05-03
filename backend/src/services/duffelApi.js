const DUFFEL_URL = 'https://api.duffel.com';
const DUFFEL_TOKEN = process.env.DUFFEL_API_KEY;

const duffelHeaders = {
    'Authorization': `Bearer ${DUFFEL_TOKEN}`,
    'Duffel-Version': 'v2',
    'Content-Type': 'application/json'
};

export const searchFlights = async ({ origin, destination, departureDate, returnDate = null, adults = 1, cabinClass = 'economy' }) => {
    try {
        const originCode = origin.trim().toUpperCase();
        const destCode = destination.trim().toUpperCase();
        
        console.log(`✈️ Buscando vuelos: ${originCode} -> ${destCode} (${departureDate})`);

        const slices = [{ origin: originCode, destination: destCode, departure_date: departureDate }];
        if (returnDate) {
            slices.push({ origin: destCode, destination: originCode, departure_date: returnDate });
        }

        const passengers = Array.from({ length: Number(adults) || 1 }, () => ({ type: 'adult' }));

        const res = await fetch(`${DUFFEL_URL}/air/offer_requests?return_offers=true`, {
            method: 'POST',
            headers: duffelHeaders,
            body: JSON.stringify({
                data: { slices, passengers, cabin_class: cabinClass?.toLowerCase() || 'economy' }
            })
        });

        if (!res.ok) {
            const err = await res.json();
            console.error('❌ Error Duffel vuelos:', err);
            throw new Error('Error al buscar vuelos en Duffel');
        }

        const data = await res.json();
        const offers = data.data?.offers || [];
        console.log(`✅ Duffel: ${offers.length} vuelos encontrados`);
        return formatFlights(offers, returnDate, Number(adults) || 1, cabinClass);

    } catch (error) {
        console.error('❌ Error en searchFlights:', error.message);
        throw error;
    }
};

const formatFlights = (offers, returnDate, adults, cabinClass) => {
    return offers.slice(0, 10).map(offer => {
        const slice = offer.slices[0];
        const firstSegment = slice.segments[0];
        const lastSegment = slice.segments[slice.segments.length - 1];

        const classMap = { economy: 'e', premium_economy: 'p', business: 'b', first: 'f' };
        const cabinParam = classMap[cabinClass?.toLowerCase()] || 'e';
        const from = firstSegment.origin.iata_code;
        const to = lastSegment.destination.iata_code;
        const dep = firstSegment.departing_at.split('T')[0];

        const bookingLink = returnDate
            ? `https://www.google.com/travel/flights?q=flights+${from}+to+${to}&hl=es&curr=EUR&cabin=${cabinParam}&adults=${adults}&return=${returnDate}`
            : `https://www.google.com/travel/flights?q=flights+${from}+to+${to}&hl=es&curr=EUR&cabin=${cabinParam}&adults=${adults}&dep=${dep}&oneway=1`;

        return {
            id: offer.id,
            price: {
                amount: parseFloat(offer.total_amount),
                currency: offer.total_currency
            },
            airline: firstSegment.marketing_carrier?.iata_code || firstSegment.operating_carrier?.iata_code,
            airlineName: firstSegment.marketing_carrier?.name || firstSegment.operating_carrier?.name,
            airlineLogo: firstSegment.marketing_carrier?.logo_symbol_url || null,
            departure: {
                airport: from,
                cityName: firstSegment.origin.city_name || from,
                time: firstSegment.departing_at
            },
            arrival: {
                airport: to,
                cityName: lastSegment.destination.city_name || to,
                time: lastSegment.arriving_at
            },
            duration: slice.duration,
            stops: slice.segments.length - 1,
            bookingLink
        };
    });
};

const CITY_TRANSLATIONS = {
    'londres': 'london',
    'paris': 'paris',
    'roma': 'rome',
    'milán': 'milan',
    'milan': 'milan',
    'múnich': 'munich',
    'munich': 'munich',
    'bruselas': 'brussels',
    'ámsterdam': 'amsterdam',
    'amsterdam': 'amsterdam',
    'estocolmo': 'stockholm',
    'copenhague': 'copenhagen',
    'atenas': 'athens',
    'moscú': 'moscow',
    'moscu': 'moscow',
    'varsovia': 'warsaw',
    'praga': 'prague',
    'viena': 'vienna',
    'berlín': 'berlin',
    'berlin': 'berlin',
    'ginebra': 'geneva',
    'zúrich': 'zurich',
    'zurich': 'zurich',
    'dubrovnik': 'dubrovnik',
    'florencia': 'florence',
    'venecia': 'venice',
    'nápoles': 'naples',
    'napoles': 'naples',
    'turín': 'turin',
    'turin': 'turin',
    'marsella': 'marseille',
    'lyon': 'lyon',
    'niza': 'nice',
    'estrasburgo': 'strasbourg',
    'burdeos': 'bordeaux',
    'nueva york': 'new york',
    'nueva jersey': 'new jersey',
    'los ángeles': 'los angeles',
    'los angeles': 'los angeles',
    'san francisco': 'san francisco',
    'chicago': 'chicago',
    'miami': 'miami',
    'washington': 'washington',
    'filadelfia': 'philadelphia',
    'boston': 'boston',
    'pekín': 'beijing',
    'pekin': 'beijing',
    'shanghái': 'shanghai',
    'shanghai': 'shanghai',
    'tokio': 'tokyo',
    'seúl': 'seoul',
    'seul': 'seoul',
    'bangkok': 'bangkok',
    'singapur': 'singapore',
    'estambul': 'istanbul',
    'el cairo': 'cairo',
    'cairo': 'cairo',
    'dubái': 'dubai',
    'dubai': 'dubai',
    'sídney': 'sydney',
    'sidney': 'sydney',
    'sydney': 'sydney',
    'melbourne': 'melbourne',
    'auckland': 'auckland',
    'buenos aires': 'buenos aires',
    'santiago de chile': 'santiago',
    'lima': 'lima',
    'bogotá': 'bogota',
    'bogota': 'bogota',
    'ciudad de méxico': 'mexico city',
    'mexico': 'mexico city',
    'la habana': 'havana',
    'río de janeiro': 'rio de janeiro',
    'rio de janeiro': 'rio de janeiro',
    'são paulo': 'sao paulo',
    'sao paulo': 'sao paulo',
    'marrakech': 'marrakech',
    'casablanca': 'casablanca',
    'túnez': 'tunis',
    'tunez': 'tunis',
    'lisboa': 'lisbon',
    'oporto': 'porto',
    'edimburgo': 'edinburgh',
    'mánchester': 'manchester',
    'manchester': 'manchester',
    'liverpool': 'liverpool',
    'dublín': 'dublin',
    'dublin': 'dublin',
    'cracovia': 'krakow',
    'budapest': 'budapest',
    'bucarest': 'bucharest',
    'belgrado': 'belgrade',
    'helsinki': 'helsinki',
    'oslo': 'oslo',
    'reikiavik': 'reykjavik',
    'reykjavik': 'reykjavik',
    'córcega': 'corsica',
    'cerdeña': 'sardinia',
    'sicilia': 'sicily',
    'creta': 'crete',
    'santorini': 'santorini',
    'ibiza': 'ibiza',
    'mallorca': 'palma de mallorca',
    'tenerife': 'tenerife',
    'gran canaria': 'gran canaria',
    'lanzarote': 'lanzarote',
    'fuerteventura': 'fuerteventura'
};

const translateQuery = (query) => {
    const lower = query.toLowerCase().trim();
    if (CITY_TRANSLATIONS[lower]) return CITY_TRANSLATIONS[lower];
    const withoutAccents = lower.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (CITY_TRANSLATIONS[withoutAccents]) return CITY_TRANSLATIONS[withoutAccents];
    return query;
};

export const searchPlaces = async (query, onlyAirports = false) => {
    try {
        const translated = translateQuery(query);
        const queries = translated !== query.toLowerCase().trim()
            ? [translated, query]
            : [query];

        let allAirports = [];
        const seenIds = new Set();

        for (const q of queries) {
            const url = `${DUFFEL_URL}/places/suggestions?query=${encodeURIComponent(q)}`;
            const res = await fetch(url, { headers: duffelHeaders });
            const data = await res.json();
            const airports = data.data || [];
            airports.forEach(a => {
                if (!seenIds.has(a.id)) {
                    seenIds.add(a.id);
                    allAirports.push(a);
                }
            });
        }

        if (onlyAirports) return allAirports;

        const citiesSeen = new Set();
        const cities = [];

        allAirports.forEach(a => {
            const cityKey = `${a.iata_city_code}-${a.iata_country_code}`;
            if (a.city_name && a.iata_city_code && !citiesSeen.has(cityKey)) {
                citiesSeen.add(cityKey);
                cities.push({
                    name: a.city_name,
                    iata_code: a.iata_city_code,
                    city_name: a.city_name,
                    country_name: a.iata_country_code,
                    type: 'city',
                    id: `cit_${a.iata_city_code.toLowerCase()}_${a.iata_country_code.toLowerCase()}`
                });
            }
        });

        return [...cities, ...allAirports];
    } catch {
        return [];
    }
};

export default { searchFlights, searchPlaces };