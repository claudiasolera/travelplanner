import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { BadgeGrid } from '../components/profile/BadgeGrid';
import { TripCommunityCard } from '../components/trips/TripCommunityCard';
import { useAuth } from '../context/AuthContext';
import { tripService } from '../services/tripService';
import { apiClient } from '../services/apiClient';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { FollowModal } from '../components/profile/FollowModal';

type Tab = 'trips' | 'badges';

export const PublicProfilePage = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('trips');

    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [likedTrips, setLikedTrips] = useState<Set<string>>(new Set());
    const [savedTrips, setSavedTrips] = useState<Set<string>>(new Set());
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [profileData, likesData, savedData, followingData] = await Promise.all([
                    userService.getPublicProfile(id!),
                    apiClient('/users/likes'),
                    apiClient('/users/trips/saved'),
                    apiClient('/users/following/list')
                ]);
                setProfile(profileData);
                setLikedTrips(new Set(likesData.likedTripIds || []));
                setSavedTrips(new Set((savedData.trips || []).map((t: any) => t.id)));
                const followingIds: string[] = followingData.following?.map((f: any) => f.id) || [];
                setIsFollowing(followingIds.includes(id!));
            } catch {
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [id]);

    const handleFollow = async () => {
        try {
            if (isFollowing) {
                await apiClient(`/users/unfollow/${id}`, { method: 'POST' });
                setIsFollowing(false);
            } else {
                await apiClient(`/users/follow/${id}`, { method: 'POST' });
                setIsFollowing(true);
            }
        } catch { }
    };

    const handleLike = async (tripId: string) => {
        try {
            if (likedTrips.has(tripId)) {
                await tripService.unlikeTrip(tripId);
                setLikedTrips(prev => { const s = new Set(prev); s.delete(tripId); return s; });
            } else {
                await tripService.likeTrip(tripId);
                setLikedTrips(prev => new Set([...prev, tripId]));
            }
        } catch { }
    };

    const handleSave = async (tripId: string) => {
        try {
            if (savedTrips.has(tripId)) {
                await tripService.unsaveTrip(tripId);
                setSavedTrips(prev => { const s = new Set(prev); s.delete(tripId); return s; });
            } else {
                await tripService.saveTrip(tripId);
                setSavedTrips(prev => new Set([...prev, tripId]));
            }
        } catch { }
    };

    const getDaysCount = (start: string, end: string) => {
        const diff = new Date(end).getTime() - new Date(start).getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen gap-2">
            <div className="spinner"/>
            <p className="text-sm text-text-secondary">Cargando perfil...</p>
        </div>
    );

    if (!profile) return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-text-secondary">Usuario no encontrado.</p>
        </div>
    );

    const isOwnProfile = user?.id === id;

    const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
        {
            key: 'trips', label: 'Viajes',
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" strokeLinejoin="round"/>
            </svg>
        },
        {
            key: 'badges', label: 'Insignias',
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
            </svg>
        },
    ];

    return (
        <div className="min-h-screen bg-bg px-6 md:px-16 py-10">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header */}
                <ProfileHeader
                    user={profile}
                    stats={{ ...profile.stats, _count: profile._count }}
                    isPublic
                    isOwnProfile={isOwnProfile}
                    isFollowing={isFollowing}
                    onFollow={handleFollow}
                    onGoToProfile={() => navigate('/profile')}
                    onShowFollowers={() => setShowFollowersModal(true)}
                    onShowFollowing={() => setShowFollowingModal(true)}
                />

                {/* Tabs */}
                <div className="bg-card flex items-center justify-around border-b border-border">
                    {tabs.map(tab => (
                        <button 
                            aria-label={tab.label}
                            key={tab.key} 
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition relative ${
                                activeTab === tab.key ? 'text-primary' : 'text-text-soft hover:text-text-secondary'
                            }`}
                        >
                            {tab.icon}
                            <span className="hidden md:block">{tab.label}</span>
                            {activeTab === tab.key && (
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"/>
                            )}
                        </button>
                    ))}
                </div>

                {activeTab === 'trips' && (
                    <div className="space-y-4">
                        {profile.trips?.length === 0 ? (
                            <div className="empty-state rounded-2xl p-10">
                                <p className="text-text-secondary text-sm">Este usuario no tiene viajes públicos.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {profile.trips.map((trip: any) => (
                                    <TripCommunityCard
                                        key={trip.id}
                                        trip={{ ...trip, user: { name: profile.name, avatar: profile.avatar } }}
                                        user={user}
                                        isLiked={likedTrips.has(trip.id)}
                                        isSaved={savedTrips.has(trip.id)}
                                        isFollowing={isFollowing}
                                        onLike={() => handleLike(trip.id)}
                                        onSave={() => handleSave(trip.id)}
                                        onFollow={handleFollow}
                                        getDaysCount={getDaysCount}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'badges' && (
                    <div className="card rounded-2xl p-5">
                        <BadgeGrid earnedBadges={profile.badges?.map((b: any) => b.type) || []} />
                    </div>
                )}

                {showFollowersModal && (
                    <FollowModal
                        title="Seguidores"
                        list={profile.followedBy || []}
                        onClose={() => setShowFollowersModal(false)}
                    />
                )}
                {showFollowingModal && (
                    <FollowModal
                        title="Siguiendo"
                        list={profile.following || []}
                        onClose={() => setShowFollowingModal(false)}
                    />
                )}
            </div>
        </div>
    );
};