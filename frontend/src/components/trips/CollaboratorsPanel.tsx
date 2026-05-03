import React, { useEffect, useState } from 'react';
import { apiClient } from '../../services/apiClient';
import { tripService } from '../../services/tripService';

interface Props {
    tripId: string;
}

export const CollaboratorsPanel = ({ tripId }: Props) => {
    const [collaborators, setCollaborators] = useState<any[]>([]);
    const [mutualFriends, setMutualFriends] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    useEffect(() => {
        tripService.getCollaborators(tripId)
            .then(r => setCollaborators(r.collaborators || []));

        Promise.all([
            apiClient('/users/following/list'),
            apiClient('/users/followers'),
        ]).then(([followingData, followersData]) => {
            const following = followingData.following || [];
            const followers = followersData.followers || [];
            const followerIds = new Set(followers.map((f: any) => f.id));
            const mutual = following.filter((f: any) => followerIds.has(f.id));
            setMutualFriends(mutual);
        });
    }, [tripId]);

    const handleSearch = async () => {
        if (!search.trim()) return;
        setSearching(true);
        try {
            const r = await apiClient(`/users/search?q=${encodeURIComponent(search)}`);
            setSearchResults(r.users || []);
        } catch { setSearchResults([]); }
        finally { setSearching(false); }
    };

    const handleAdd = async (userId: string) => {
        try {
            await tripService.addCollaborator(tripId, userId);
            const r = await tripService.getCollaborators(tripId);
            setCollaborators(r.collaborators || []);
            setSearchResults([]);
            setSearch('');
        } catch { alert('Error al añadir colaborador'); }
    };

    const handleRemove = async (userId: string) => {
        try {
            await tripService.removeCollaborator(tripId, userId);
            setCollaborators(prev => prev.filter(c => c.id !== userId));
        } catch { alert('Error al eliminar colaborador'); }
    };

    const collaboratorIds = new Set(collaborators.map(c => c.id));

    const AvatarCircle = ({ user }: { user: any }) => (
        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0" style={{ border: '2px solid white' }}>
            {user.avatar?.startsWith('http') || user.avatar?.startsWith('data:') ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full bg-primary flex items-center justify-center text-white text-xs font-medium">
                    {user.avatar || user.name?.charAt(0).toUpperCase()}
                </div>
            )}
        </div>
    );

    return (
        <div className="card rounded-2xl p-5 space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text">
                    Colaboradores
                </h3>
                <button 
                    aria-label={showSearch ? 'Cerrar búsqueda' : 'Buscar colaborador'}
                    onClick={() => setShowSearch(!showSearch)} 
                    className="btn text-sm py-1.5 px-3"
                >
                    {showSearch ? 'Cerrar' : '+ Buscar'}
                </button>
            </div>

            {showSearch && (
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <input
                            aria-label="Buscar por nombre o email de colaborador"
                            className="input px-3 py-2 flex-1 min-w-0"
                            placeholder="Buscar por nombre o email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        />
                        <button 
                            aria-label="Buscar colaborador"
                            onClick={handleSearch} 
                            className="btn text-sm py-2 px-4 shrink-0"
                        >
                            {searching ? '...' : 'Buscar'}
                        </button>
                    </div>
                    {searchResults.length > 0 && (
                        <div className="card rounded-xl overflow-hidden">
                            {searchResults.map(u => (
                                <div key={u.id} className="flex items-center justify-between px-3 py-2.5 hover:bg-primary-light transition">
                                    <div className="flex items-center gap-3">
                                        <AvatarCircle user={u} />
                                        <div>
                                            <p className="text-sm font-medium text-text">{u.name}</p>
                                            <p className="text-xs text-text-secondary">{u.email}</p>
                                        </div>
                                    </div>
                                    <button 
                                        aria-label={`Añadir colaborador: ${u.name}`}
                                        onClick={() => handleAdd(u.id)}
                                        className="text-xs text-primary hover:underline font-medium"
                                    >
                                        Añadir
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    {searchResults.length === 0 && search && !searching && (
                        <p className="text-xs text-text-secondary px-1">No se encontraron usuarios.</p>
                    )}
                </div>
            )}

            {mutualFriends.length > 0 && (
                <div>
                    <p className="text-xs text-text-secondary mb-3">Amigos</p>
                    <div className="space-y-2">
                        {mutualFriends.map(u => (
                            <div key={u.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <AvatarCircle user={u} />
                                    <div>
                                        <p className="text-sm font-medium text-text">{u.name}</p>
                                        <p className="text-xs text-text-secondary">{u.email}</p>
                                    </div>
                                </div>
                                {collaboratorIds.has(u.id) ? (
                                    <button 
                                        aria-label={`Quitar colaborador: ${u.name}`}
                                        onClick={() => handleRemove(u.id)}
                                        className="text-xs text-red-400 hover:text-red-600 transition font-medium">
                                        Quitar
                                    </button>
                                ) : (
                                    <button 
                                        aria-label={`Añadir colaborador: ${u.name}`}
                                        onClick={() => handleAdd(u.id)}
                                        className="text-xs text-primary hover:underline font-medium"
                                    >
                                        Añadir
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {collaborators.length > 0 && (
                <div>
                    <p className="text-xs text-text-secondary mb-3">En este viaje</p>
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex -space-x-2">
                            {collaborators.map(c => (
                                <div key={c.id} title={c.name}>
                                    <AvatarCircle user={c} />
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-text-secondary ml-1">
                            {collaborators.map(c => c.name).join(', ')}
                        </p>
                    </div>
                </div>
            )}

            {collaborators.length === 0 && mutualFriends.length === 0 && (
                <p className="text-sm text-text-secondary text-center py-2">
                    Aún no tienes amigos mutuos ni colaboradores.
                </p>
            )}
        </div>
    );
};