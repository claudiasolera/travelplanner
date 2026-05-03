const BASE_URL = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api';

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    const isFormData = options.body instanceof FormData;

    const headers = {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    try {
        const response = await fetch(`${BASE_URL}${cleanEndpoint}`, { ...options, headers });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            
            if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            throw new Error(errorData.error || errorData.message || 'Error en la petición');
        }

        return response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};