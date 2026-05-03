export const CHECKLIST_CATEGORIES = ['Personal', 'Ropa', 'Electrónica', 'Documentación', 'Otros'];
export const TASK_CATEGORIES = ['Vuelos', 'Alojamiento', 'Transporte', 'Actividades', 'Documentos', 'Otros'];
export const STATUSES = ['Pendiente', 'En progreso', 'Completada'];
export const PRIORITIES = ['Alta', 'Media', 'Baja'];

export const priorityColor: Record<string, string> = {
    'Alta':  'bg-red-50 text-red-600',
    'Media': 'bg-amber-50 text-amber-600',
    'Baja':  'bg-green-50 text-green-600',
};

export const statusColor: Record<string, string> = {
    'Pendiente':   'bg-gray-50 text-gray-500',
    'En progreso': 'bg-primary-light text-primary',
    'Completada':  'bg-green-50 text-green-600',
};