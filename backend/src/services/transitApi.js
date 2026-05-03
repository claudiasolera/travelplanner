class TransitService {
    constructor() {
        this.baseREST = 'https://transit.land/api/v2/rest';
        this.apiKey = process.env.TRANSITLAND_API_KEY;
    }

    async getRoute({ fromLat, fromLon }) {
        console.log("🛤️ Consultando rutas en TransitLand...");
        
        const routeData = await this.fetchFromTransitland('/routes', {
            lat: fromLat,
            lon: fromLon,
            radius: 2500,
            limit: 20,
            include: 'agency'
        });

        if (!routeData || !routeData.routes || routeData.routes.length === 0) {
            console.log("⚠️ No se detectaron rutas directas, intentando via paradas...");
            return []; 
        }

        const uniqueRoutes = [];
        const seen = new Set();

        routeData.routes.forEach(r => {
            const type = this.getVehicleName(r.vehicle_type);
            const lineName = r.route_short_name || r.route_long_name || "S/N";
            const identifier = `${lineName}-${type}`;

            if (!seen.has(identifier)) {
                seen.add(identifier);
                
                let operadorName = "Urbano";
                if (r.agency?.agency_name) {
                    operadorName = r.agency.agency_name;
                } else if (r.agency_onestop_id) {
                    operadorName = r.agency_onestop_id.split('-')[1]?.toUpperCase() || "Urbano";
                }

                uniqueRoutes.push({
                    linea: lineName,
                    tipo: type,
                    color: r.route_color ? `#${r.route_color}` : '#333333',
                    operador: operadorName
                });
            }
        });

        return uniqueRoutes;
    }

    getVehicleName(type) {
        if (typeof type === 'string') {
            const strTypes = {
                'bus': 'Autobús',
                'rail': 'Tren',
                'subway': 'Metro',
                'tram': 'Tranvía',
                'ferry': 'Ferry',
                'cable_car': 'Teleférico',
                'gondola': 'Góndola',
                'funicular': 'Funicular',
            };
            return strTypes[type.toLowerCase()] || type;
        }
        const types = {
            0: "Tranvía", 1: "Metro", 2: "Tren", 3: "Autobús",
            100: "Tren", 109: "Tren suburbano", 400: "Metro", 1000: "Ferry"
        };
        return types[type] || "Transporte Público";
    }

    async fetchFromTransitland(endpoint, extraParams) {
        const params = new URLSearchParams({
            ...extraParams,
            apikey: this.apiKey
        });

        const finalUrl = `${this.baseREST}${endpoint}?${params}`;

        try {
            const response = await fetch(`${this.baseREST}${endpoint}?${params}`);
            if (!response.ok) return null;
            return await response.json();
        } catch (err) {
            console.error("Error en fetch:", err.message);
            return null;
        }
    }
}

export default new TransitService();