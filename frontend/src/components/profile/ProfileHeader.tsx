
interface Props {
    user: any;
    stats: any;
    onEdit?: () => void;
    onShowFollowers?: () => void;
    onShowFollowing?: () => void;
    isPublic?: boolean;
    isFollowing?: boolean;
    isOwnProfile?: boolean;
    onFollow?: () => void;
    onGoToProfile?: () => void;
}

export const ProfileHeader = ({
    user, stats, onEdit, onShowFollowers, onShowFollowing,
    isPublic, isFollowing, isOwnProfile, onFollow, onGoToProfile
}: Props) => {
    return (
        <div className="rounded-3xl p-6 md:p-8">
            <div className="hidden md:flex items-center gap-6">
                <div className="relative shrink-0">
                    <div className="w-32 h-32 rounded-full overflow-hidden" style={{ border: '1px solid #d1d5db' }}>
                        {user?.avatar?.startsWith('http') || user?.avatar?.startsWith('data:') ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-primary flex items-center justify-center text-4xl">
                                {user?.avatar || user?.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-text">{user?.name || 'Viajero'}</h1>
                    {!isPublic && <p className="text-sm text-text-secondary mt-0.5">{user?.email}</p>}
                    {!isPublic && (
                        <span className="inline-block mt-2 text-xs bg-primary-light text-primary px-2.5 py-0.5 rounded-full font-medium">
                            Viajero
                        </span>
                    )}
                    {stats && (
                        <div className="flex items-center gap-4 mt-4 flex-wrap">
                            <div className="flex items-baseline gap-1">
                                <span className="text-base font-bold text-text">
                                    {isPublic ? stats._count?.trips || 0 : stats.trips || 0}
                                </span>
                                <span className="text-xs text-text-secondary">
                                    viajes
                                </span>
                            </div>
                            <div className="w-px h-4 bg-border"/>
                            <button 
                                aria-label="Mostrar siguiendo" 
                                onClick={onShowFollowing} 
                                className="flex items-baseline gap-1 hover:opacity-70 transition"
                            >
                                <span className="text-base font-bold text-text">
                                    {isPublic ? stats._count?.following || 0 : stats.following || 0}
                                </span>
                                <span className="text-xs text-text-secondary">
                                    siguiendo
                                </span>
                            </button>
                            <div className="w-px h-4 bg-border"/>
                            <button 
                                aria-label="Mostrar seguidores" 
                                onClick={onShowFollowers} 
                                className="flex items-baseline gap-1 hover:opacity-70 transition"
                            >
                                <span className="text-base font-bold text-text">
                                    {isPublic ? stats._count?.followedBy || 0 : stats.followedBy || 0}
                                </span>
                                <span className="text-xs text-text-secondary">
                                    seguidores
                                </span>
                            </button>
                            {!isPublic && (
                                <>
                                    <div className="w-px h-4 bg-border"/>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-base font-bold text-text">{stats.countries || 0}</span>
                                        <span className="text-xs text-text-secondary">países</span>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
                {isPublic ? (
                    isOwnProfile ? (
                        <button 
                            aria-label="Editar perfil" 
                            onClick={onGoToProfile} 
                            className="btn text-sm py-2 px-5 shrink-0"
                        >
                            Editar perfil
                        </button>
                    ) : (
                        <button 
                            aria-label={isFollowing ? "Dejar de seguir" : "Seguir"} 
                            onClick={onFollow}
                            className={`text-sm py-2 px-5 shrink-0 rounded-full border transition font-medium ${isFollowing ? 'bg-primary-light text-primary border-primary' : 'btn'}`}
                        >
                            {isFollowing ? 'Siguiendo' : '+ Seguir'}
                        </button>
                    )
                ) : (
                    <button 
                        aria-label="Editar perfil" 
                        onClick={onEdit} 
                        className="btn text-sm py-2 px-4 flex items-center gap-2 shrink-0"
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Editar perfil
                    </button>
                )}
            </div>

            <div className="md:hidden">
                <div className="flex items-center gap-5">
                    <div className="shrink-0">
                        <div className="w-20 h-20 rounded-full overflow-hidden" style={{ border: '1px solid #d1d5db' }}>
                            {user?.avatar?.startsWith('http') || user?.avatar?.startsWith('data:') ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-primary flex items-center justify-center text-2xl">
                                    {user?.avatar || user?.name?.charAt(0).toUpperCase() || '?'}
                                </div>
                            )}
                        </div>
                    </div>
                    {stats && (
                        <div className="flex-1 flex items-center justify-around">
                            <div className="flex flex-col items-center">
                                <span className="text-lg font-bold text-text">{isPublic ? stats._count?.trips || 0 : stats.trips || 0}</span>
                                <span className="text-[11px] text-text-secondary">viajes</span>
                            </div>
                            <button 
                                aria-label="Mostrar seguidores" 
                                onClick={onShowFollowers} 
                                className="flex flex-col items-center hover:opacity-70 transition"
                            >
                                <span className="text-lg font-bold text-text">{isPublic ? stats._count?.followedBy || 0 : stats.followedBy || 0}</span>
                                <span className="text-[11px] text-text-secondary">seguidores</span>
                            </button>
                            <button 
                                aria-label="Mostrar siguiendo" 
                                onClick={onShowFollowing} 
                                className="flex flex-col items-center hover:opacity-70 transition"
                            >
                                <span className="text-lg font-bold text-text">{isPublic ? stats._count?.following || 0 : stats.following || 0}</span>
                                <span className="text-[11px] text-text-secondary">siguiendo</span>
                            </button>
                            {!isPublic && (
                                <div className="flex flex-col items-center">
                                    <span className="text-lg font-bold text-text">{stats.countries || 0}</span>
                                    <span className="text-[11px] text-text-secondary">países</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-3">
                    <h1 className="text-base font-bold text-text">{user?.name || 'Viajero'}</h1>
                    {!isPublic && <p className="text-xs text-text-secondary">{user?.email}</p>}
                    {!isPublic && (
                        <span className="inline-block mt-1 text-[10px] bg-primary-light text-primary px-2 py-0.5 rounded-full font-medium">
                            Viajero
                        </span>
                    )}
                </div>

                <div className="mt-4">
                    {isPublic ? (
                        isOwnProfile ? (
                            <button 
                                aria-label="Editar perfil" 
                                onClick={onGoToProfile} 
                                className="btn text-sm py-2 w-full"
                            >
                                Editar perfil
                            </button>
                        ) : (
                            <button 
                                aria-label={isFollowing ? "Dejar de seguir" : "Seguir"} 
                                onClick={onFollow}
                                className={`text-sm py-2 w-full rounded-full border transition font-medium ${isFollowing ? 'bg-primary-light text-primary border-primary' : 'btn'}`}
                            >
                                {isFollowing ? 'Siguiendo' : '+ Seguir'}
                            </button>
                        )
                    ) : (
                        <button 
                            aria-label="Editar perfil" 
                            onClick={onEdit} 
                            className="btn text-sm py-2 w-full flex items-center justify-center gap-2"
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                            Editar perfil
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};