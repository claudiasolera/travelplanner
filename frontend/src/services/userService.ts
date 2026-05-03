import { apiClient } from "./apiClient";

export const userService = {
    getMyProfile: () => apiClient('/user/me'),

    getNotifications: () => apiClient('/user/notifications'),

    markNotificationsRead: () => apiClient('/user/notifications/read', {
        method: 'PUT'
    }),

    followUser: (idUserToFollow: number) => apiClient(`/user/follow/${idUserToFollow}`, {
        method: 'POST'
    }),

    unfollowUser: (idUserToUnfollow: number) => apiClient(`/user/unfollow/${idUserToUnfollow}`, {
        method: 'POST'
    }),

    getPublicProfile: (userId: string) => apiClient(`/users/${userId}/profile`),
};