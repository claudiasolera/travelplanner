const LITEAPI_URL = 'https://api.liteapi.travel/v3.0';
const LITEAPI_KEY = process.env.LITEAPI_API_KEY;

const liteHeaders = {
    'X-API-Key': LITEAPI_KEY,
    'Content-Type': 'application/json'
};

export const searchHotels = async ({ lat, lon, checkInDate, checkOutDate, adults = 1, limit = 10 }) => {
    try {
        const hotelsRes = await fetch(
            `${LITEAPI_URL}/data/hotels?latitude=${lat}&longitude=${lon}&distance=10&limit=${limit}`,
            { headers: liteHeaders }
        );

        if (!hotelsRes.ok) throw new Error('Error al obtener hoteles de liteAPI');

        const hotelsData = await hotelsRes.json();
        const hotels = hotelsData.data || [];
        if (hotels.length === 0) return [];

        console.log(`✅ liteAPI: ${hotels.length} hoteles encontrados`);

        const hotelIds = hotels.map(h => h.id);

        const ratesRes = await fetch(`${LITEAPI_URL}/hotels/rates`, {
            method: 'POST',
            headers: liteHeaders,
            body: JSON.stringify({
                hotelIds,
                checkin: checkInDate,
                checkout: checkOutDate,
                occupancies: [{ adults: Number(adults) || 1 }],
                currency: 'EUR',
                guestNationality: 'ES'
            })
        });

        const ratesData = ratesRes.ok ? await ratesRes.json() : null;
        console.log('📦 Rates response:', JSON.stringify(ratesData?.data?.[0], null, 2));
        const rates = ratesData?.data || [];

        return formatHotels(hotels, rates);

    } catch (error) {
        console.error('❌ Error en searchHotels:', error.message);
        throw error;
    }
};

const formatHotels = (hotels, rates) => {
    return hotels.map(hotel => {
        const hotelRates = rates.find(r => r.hotelId === hotel.id);

        const offer = hotelRates?.roomTypes?.[0]?.offers?.[0]
            ?? hotelRates?.roomTypes?.[0];

        const price = offer?.offerRetailRate
            ?? offer?.retailRate?.total?.[0]
            ?? null;

        console.log(`🏨 ${hotel.name} → hotelId: ${hotel.id} → precio: ${price?.amount}`);

        return {
            hotelId: hotel.id,
            name: hotel.name,
            description: hotel.hotelDescription?.replace(/<[^>]*>/g, '') || '',
            rating: hotel.stars || 0,
            reviewScore: hotel.rating || null,
            reviewCount: hotel.reviewCount || 0,
            price: {
                amount: price?.amount ? parseFloat(price.amount) : null,
                currency: price?.currency || 'EUR',
                note: price?.amount ? 'Precio Final' : 'Consultar Disponibilidad'
            },
            address: {
                fullAddress: hotel.address || '',
                cityName: hotel.city || '',
                postalCode: hotel.zip || ''
            },
            location: {
                lat: hotel.latitude || null,
                lon: hotel.longitude || null
            },
            photos: [hotel.main_photo, hotel.thumbnail].filter(Boolean),
            bookingLink: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotel.name)}`
        };
    });
};

export default { searchHotels };