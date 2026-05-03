import { apiClient } from './apiClient';

export const checklistService = {
    getChecklist: (tripId: string) => apiClient(`/checklist/${tripId}/checklist`),

    addItem: (tripId: string, data: { category: string; text: string }) =>
        apiClient(`/checklist/${tripId}/checklist`, { method: 'POST', body: JSON.stringify(data) }),

    toggleItem: (itemId: string) =>
        apiClient(`/checklist/checklist/${itemId}/toggle`, { method: 'PATCH' }),

    deleteItem: (itemId: string) =>
        apiClient(`/checklist/checklist/${itemId}`, { method: 'DELETE' }),

    getTasks: (tripId: string) => apiClient(`/checklist/${tripId}/tasks`),

    addTask: (tripId: string, data: any) =>
        apiClient(`/checklist/${tripId}/tasks`, { method: 'POST', body: JSON.stringify(data) }),

    updateTask: (taskId: string, data: any) =>
        apiClient(`/checklist/tasks/${taskId}`, { method: 'PATCH', body: JSON.stringify(data) }),
    
    deleteTask: (taskId: string) =>
        apiClient(`/checklist/tasks/${taskId}`, { method: 'DELETE' }),
};