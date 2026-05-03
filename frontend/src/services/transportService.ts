import { apiClient } from './apiClient';

export const transportService = {
    compare: async (fromLat: number, fromLon: number, toLat: number, toLon: number, extras?: {
        origin?: string;
        destination?: string;
        equipaje?: 'mochila' | 'cabina' | 'pesado';
        horaLlegada?: string | null;
    }) => {
        try {
            const res = await apiClient('/transport/compare', {
                method: 'POST',
                body: JSON.stringify({
                    fromLat, fromLon, toLat, toLon,
                    origin: extras?.origin,
                    destination: extras?.destination,
                    equipaje: extras?.equipaje || 'cabina',
                    horaLlegada: extras?.horaLlegada || null
                })
            });
            if (res?.status === 'error') {
                const err: any = new Error(res.message || 'Error en la comparativa');
                err.code = res.code;
                err.distanciaKm = res.distanciaKm;
                throw err;
            }
            return res;
        } catch (err: any) {
            if (err.code) throw err;
            const wrapped: any = new Error(err.message || 'Error de red');
            wrapped.code = 'NETWORK_ERROR';
            throw wrapped;
        }
    }
};

export const geocode = async (query: string): Promise<{ lat: number; lon: number; name: string } | null> => {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`
        );
        const data = await res.json();
        if (!data?.[0]) return null;
        return {
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon),
            name: data[0].display_name
        };
    } catch {
        return null;
    }
};

export const geocodeAirport = async (query: string): Promise<{ lat: number; lon: number; name: string } | null> => {
    const iataMatch = query.match(/\(([A-Z]{3})\)/);
    const sinParentesis = query.replace(/\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();

    const queries = [
        sinParentesis,
        iataMatch ? `${iataMatch[1]} airport` : null,
        sinParentesis.replace(/airport/i, '').trim() + ' airport',
    ].filter(Boolean) as string[];

    for (const q of queries) {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`
            );
            const data = await res.json();
            if (data?.[0]) {
                return {
                    lat: parseFloat(data[0].lat),
                    lon: parseFloat(data[0].lon),
                    name: data[0].display_name
                };
            }
        } catch {}
    }

    return null;
};