export interface IUser {
    idUser: number;
    username: string;
    email: string;
    role: 'USER' | 'ADMIN' | 'COMPANY';
    followersCount?: number;
    followingCount?: number;
}

export interface INotification {
    idNotification: number;
    message: string;
    isRead: boolean;
    createdAt: string;
}