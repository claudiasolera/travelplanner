import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface Props {
    u: {
        id: string;
        name?: string;
        avatar?: string;
    };
}

export const UserCard: React.FC<Props> = ({ u }) => {
    const { user } = useAuth();
    const isOwnProfile = user?.id === u.id;

    return (
        <Link to={isOwnProfile ? '/profile' : `/user/${u.id}`} className="hover:opacity-80 transition">
            <div className="rounded-2xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full overflow-hidden flex items-center justify-center shrink-0">
                    {u.avatar?.startsWith('http') || u.avatar?.startsWith('data:') ? (
                        <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                    ) : u.avatar ? (
                        <span className="text-lg">{u.avatar}</span>
                    ) : (
                        <span className="text-sm font-bold text-white">
                            {u.name?.charAt(0).toUpperCase() || '?'}
                        </span>
                    )}
                </div>
                <p className="font-semibold text-text text-sm">{u.name || 'Viajero'}</p>
            </div>
        </Link>
    );
};