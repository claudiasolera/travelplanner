import { apiClient } from "./apiClient";

export const authService = {
    register: async (userData: any) => {
        return await apiClient('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    login: async (credentials: any) => {
        const data = await apiClient('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        return data;
    },

    logout: async () => {
        try {
            
            await apiClient('/auth/logout', {
                method: 'POST'
            });
        } catch (error) {
            console.error("Error comunicando logout al servidor", error);
        } finally {
            
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    }
};