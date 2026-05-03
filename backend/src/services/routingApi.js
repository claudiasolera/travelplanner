// calcula la distancia exacta y tiempo de viaje entre dos coordenadas
class RoutingService {
    constructor() {
        this.baseURL = 'https://routing.openstreetmap.de/routed-car/route/v1/driving';
    }

    async getTravelData(fromLat, fromLon, toLat, toLon) {
        try {
            const url = `${this.baseURL}/${fromLon},${fromLat};${toLon},${toLat}?overview=false`;
            
            console.log("🚗 Consultando ruta gratuita (OSRM)...");
            const response = await fetch(url);
            const data = await response.json();

            if (data.code === "Ok") {
                const route = data.routes[0];
                return {
                    distancia: (route.distance / 1000).toFixed(1) + " km",
                    duracion: Math.round(route.duration / 60) + " min",
                    duracion_segundos: Math.round(route.duration)
                };
            }
            return null;
        } catch (error) {
            console.error("🚨 Error en RoutingService:", error.message);
            return null;
        }
    }
}

export default new RoutingService();