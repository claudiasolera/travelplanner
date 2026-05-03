export type TransportMode = 'to_airport' | 'from_airport';
export type Equipaje = 'mochila' | 'cabina' | 'pesado';
export type OptionKey = 'publico' | 'privado';

export interface Coords {
    lat: number;
    lon: number;
    name: string;
}

export interface TransportEnlace {
    label: string;
    url: string;
}

export interface TransportServicio {
    nombre: string;
    tipo: string;
    precio_aprox: string;
    app: string;
}

export interface TransportParada {
    nombre: string;
    direccion?: string;
}

export interface TransportLinea {
    linea: string;
    tipo: string;
    operador: string;
    color: string;
}

export interface TransportOption {
    titulo: string;
    medio: string;
    lineaRecomendada: TransportLinea | null;
    razonRecomendada: string | null;
    lineas: TransportLinea[];
    operador: string;
    tiempo_min: number;
    precio_eur: number | null;
    precio_desconocido: boolean;
    descripcion_corta: string;
    adecuado_equipaje: boolean;
    donde_comprar: string;
    metodo_pago: string;
    enlaces: TransportEnlace[];
    servicios_disponibles?: TransportServicio[];
}

export interface TransportClima {
    temperatura: string;
    descripcion: string;
    icono: string;
}

export interface TransportResult {
    resumen?: { distancia: string; tiempoEstimadoCoche: string };
    clima?: TransportClima;
    recomendacion?: string;
    avisoContextual?: string | null;
    opciones?: Record<OptionKey, TransportOption>;
    transportePublico?: any[];
}

export interface TransportInputs {
    origin: string;
    airport: string;
    hotel: string;
}

export const EQUIPAJE_OPTIONS: { key: Equipaje; label: string; desc: string }[] = [
    { key: 'mochila', label: 'Solo mochila', desc: 'Ligero' },
    { key: 'cabina', label: 'Maleta cabina', desc: 'Tolera transbordos' },
    { key: 'pesado', label: 'Pesado', desc: 'Evita escaleras' }
];

export const OPTION_COLORS: Record<OptionKey, { bg: string; light: string; text: string; border: string }> = {
    publico: { bg: '#2563EB', light: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-500' },
    privado: { bg: '#8b5cf6', light: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-500' }
};

export const OPTION_TITLES: Record<OptionKey, string> = {
    publico: 'Transporte Público',
    privado: 'Taxi / VTC'
};

export interface SavedTransport {
    id: string;
    tripId: string;
    mode: 'publico' | 'privado';
    origin: string;
    destination: string;
    duration: number | null;
    price: number | null;
    lineaRecomendada: string | null;
    tipoTransporte: string | null;
    operador: string | null;
    notas: string | null;
    createdAt: string;
}