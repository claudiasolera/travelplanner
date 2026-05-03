import { useAuth } from '../context/AuthContext';
import { TripCommunityCard } from '../components/trips/TripCommunityCard';
import { CommunitySearchBar } from '../components/community/CommunitySearchBar';
import { useCommunity } from '../hooks/useCommunity';
import { homepage } from '../lib/cloudinary';

export const CommunityPage = () => {
    const { user } = useAuth();
    const {
        filtered, loading,
        searchQuery, setSearchQuery,
        durationFilter, setDurationFilter,
        budgetFilter, setBudgetFilter,
        sortBy, setSortBy,
        likedTrips, savedTrips, followingUsers,
        clearFilters, handleFollow, handleLike, handleSave, getDaysCount
    } = useCommunity();

    return (
        <div className="min-h-screen bg-primary-light">
            <div className="w-full px-6 relative overflow-hidden" style={{ height: '380px' }}>
                <div className="absolute inset-0 z-0">
                    <img 
                        src={homepage.heroBanners.comunidad.src} 
                        alt={homepage.heroBanners.comunidad.alt} 
                        className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/45"/>
                </div>
                <div className="max-w-4xl mx-auto text-center pt-16 mb-8 relative z-10">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Descubre viajes de la <span className="text-primary-light">comunidad</span>
                    </h1>
                    <p className="text-white/80 text-sm">
                        Inspírate con los viajes de otros viajeros y comparte los tuyos.
                    </p>
                </div>
                <CommunitySearchBar
                    searchQuery={searchQuery} durationFilter={durationFilter}
                    budgetFilter={budgetFilter} sortBy={sortBy} filteredCount={filtered.length}
                    onSearchChange={setSearchQuery} onDurationChange={setDurationFilter}
                    onBudgetChange={setBudgetFilter} onSortChange={setSortBy} onClear={clearFilters}
                />
            </div>

            <div className="max-w-6xl mx-auto px-6 py-10">
                {loading ? (
                    <div className="flex items-center justify-center py-20 gap-3">
                        <div className="spinner"/>
                            <p className="text-sm text-text-secondary">
                                Cargando viajes...
                            </p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg bg-primary-light empty-state py-20">
                        <p className="text-xl font-semibold text-text mb-2">
                            No se encontraron viajes
                        </p>
                        <p className="text-text-secondary text-sm mb-4">
                            Prueba a cambiar los filtros de búsqueda.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.map(trip => (
                            <TripCommunityCard key={trip.id} trip={trip} user={user}
                                isLiked={likedTrips.has(trip.id)} isSaved={savedTrips.has(trip.id)}
                                isFollowing={followingUsers.has(trip.userId)}
                                onLike={() => handleLike(trip.id)} onSave={() => handleSave(trip.id)}
                                onFollow={() => handleFollow(trip.userId)} getDaysCount={getDaysCount}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};