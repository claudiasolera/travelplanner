export interface Activity {
    id: string;
    name: string;
    type: string;
    time: string;
    notes: string;
    amount?: number;
    location?: { lat: number; lon: number };
    photos?: string[];
}

export interface DayData {
    id: string;
    day: number;
    date: string;
    title?: string;
    notes?: string;
    activities: Activity[];
}

export const activityTypes = ['Actividad', 'Restaurante', 'Transporte', 'Alojamiento', 'Compras', 'Otro'];

export const activityTypeColors: Record<string, string> = {
    'Restaurante': 'bg-orange-50 text-orange-500',
    'Transporte':  'bg-blue-50 text-blue-500',
    'Alojamiento': 'bg-purple-50 text-purple-500',
    'Compras':     'bg-pink-50 text-pink-500',
    'Actividad':   'bg-green-50 text-green-500',
    'Otro':        'bg-gray-50 text-gray-500',
};