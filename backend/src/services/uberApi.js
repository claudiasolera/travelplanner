class UberService {
    getEstimates({ distanciaKm, tiempoMin }) {
        const dist = parseFloat(distanciaKm?.toString().replace(/[^\d.]/g, '')) || 0;
        const mins = parseInt(tiempoMin?.toString().replace(/[^\d.]/g, '')) || 0;

        // estima precios
        const base = 3.50;
        const porKm = 1.25;
        const porMin = 0.15;
        
        const subtotal = base + (dist * porKm) + (mins * porMin);

        return [
            {
                servicio: "UberX",
                precio: `€${subtotal.toFixed(2)}`,
                tiempoEspera: "5 min"
            },
            {
                servicio: "Uber Black",
                precio: `€${(subtotal * 1.6).toFixed(2)}`,
                tiempoEspera: "3 min"
            }
        ];
    }
}
export default new UberService();