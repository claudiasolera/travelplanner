import React, { JSX, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/apiClient';
import { Link } from 'react-router-dom';
import { BadgeGrid } from '../components/profile/BadgeGrid';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { TripListItem } from '../components/profile/TripListItem';
import { EditProfileForm } from '../components/profile/EditProfileForm';
import { FollowModal } from '../components/profile/FollowModal';

type ProfileTab = 'stats' | 'trips' | 'saved' | 'badges';

const tabs: { key: ProfileTab; label: string; icon: JSX.Element }[] = [
    {
        key: 'stats', label: 'Estadísticas',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
    },
    {
        key: 'trips', label: 'Mis viajes',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
            <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" strokeLinejoin="round"/>
        </svg>
    },
    {
        key: 'saved', label: 'Guardados',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
        </svg>
    },
    {
        key: 'badges', label: 'Insignias',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
            <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
        </svg>
    },
];

export const ProfilePage: React.FC = () => {
    const { user, loginUser } = useAuth();
    const [activeTab, setActiveTab] = useState<ProfileTab>('stats');
    const [stats, setStats] = useState<any>(null);
    const [trips, setTrips] = useState<any[]>([]);
    const [savedTrips, setSavedTrips] = useState<any[]>([]);
    const [followers, setFollowers] = useState<any[]>([]);
    const [following, setFollowing] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingProfile, setEditingProfile] = useState(false);
    const [editName, setEditName] = useState(user?.name || '');
    const [editAvatar, setEditAvatar] = useState(user?.avatar || '');
    const [savingProfile, setSavingProfile] = useState(false);
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                await apiClient('/users/badges/check', { method: 'POST' });
                const [statsData, tripsData, savedData, followersData, followingData] = await Promise.all([
                    apiClient('/users/stats'),
                    apiClient('/users/trips/history'),
                    apiClient('/users/trips/saved'),
                    apiClient('/users/followers'),
                    apiClient('/users/following/list')
                ]);
                setStats(statsData);
                setTrips(tripsData.trips || []);
                setSavedTrips(savedData.trips || []);
                setFollowers(followersData.followers || []);
                setFollowing(followingData.following || []);
            } catch { } finally { setLoading(false); }
        };
        fetchAll();
    }, []);

    const handleSaveProfile = async () => {
        setSavingProfile(true);
        try {
            let response;
            if (editAvatar?.startsWith('data:')) {
                const formData = new FormData();
                if (editName) formData.append('name', editName);
                const res = await fetch(editAvatar);
                const blob = await res.blob();
                formData.append('avatar', blob, 'avatar.jpg');
                response = await apiClient('/users/me', { method: 'PATCH', body: formData });
            } else {
                response = await apiClient('/users/me', {
                    method: 'PATCH',
                    body: JSON.stringify({ name: editName, avatar: editAvatar })
                });
            }
            const token = localStorage.getItem('token') || '';
            loginUser({ ...user, ...response.user }, token);
            setEditingProfile(false);
        } catch {
            alert('Error al guardar el perfil');
        } finally {
            setSavingProfile(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg px-6 md:px-16 py-10">
            <div className="max-w-4xl mx-auto space-y-6">

                {editingProfile ? (
                    <EditProfileForm
                        editName={editName}
                        editAvatar={editAvatar}
                        saving={savingProfile}
                        onNameChange={setEditName}
                        onAvatarChange={setEditAvatar}
                        onSave={handleSaveProfile}
                        onCancel={() => setEditingProfile(false)}
                    />
                ) : (
                    <ProfileHeader
                        user={user}
                        stats={stats}
                        onEdit={() => { setEditingProfile(true); setEditName(user?.name || ''); setEditAvatar(user?.avatar || ''); }}
                        onShowFollowers={() => setShowFollowersModal(true)}
                        onShowFollowing={() => setShowFollowingModal(true)}
                    />
                )}

                {!editingProfile && (
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
                )}

                {!editingProfile && (
                    loading ? (
                        <div className="flex items-center justify-center py-12 gap-2">
                            <div className="spinner-sm"/>
                            <p className="text-sm text-text-secondary">Cargando...</p>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'stats' && stats && (
                                <div className="space-y-5">
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { value: stats.countries, label: 'Países' },
                                            { value: `${(stats.kmFlown/1000).toFixed(0)}k`, label: 'Km volados' },
                                            { value: stats.trips, label: 'Viajes' },
                                        ].map((s, i) => (
                                            <div key={i} className="card-lg rounded-2xl p-4 flex flex-col items-center gap-2 text-center">
                                                <p className="text-2xl font-bold text-text">{s.value}</p>
                                                <p className="text-xs text-text-secondary">{s.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {stats.countriesList?.length > 0 && (
                                        <div className="card-lg rounded-2xl p-5">
                                            <h3 className="font-semibold text-text mb-3">Países visitados</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {stats.countriesList.map((c: string) => (
                                                    <span key={c} className="pill">
                                                        {c}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'trips' && (
                                <div className="space-y-3">
                                    {trips.length === 0 ? (
                                        <div className="empty-state rounded-2xl p-10">
                                            <p className="text-text-secondary text-sm mb-2">No tienes viajes todavía.</p>
                                            <Link to="/create-trip" className="text-primary hover:underline text-sm font-medium">Crear un viaje →</Link>
                                        </div>
                                    ) : trips.map(trip => (
                                        <TripListItem key={trip.id} trip={trip} mode="own" />
                                    ))}
                                </div>
                            )}

                            {activeTab === 'saved' && (
                                <div className="space-y-3">
                                    {savedTrips.length === 0 ? (
                                        <div className="empty-state rounded-2xl p-10">
                                            <p className="text-text-secondary text-sm mb-2">No tienes viajes guardados.</p>
                                            <Link to="/community" className="text-primary hover:underline text-sm font-medium">Explorar comunidad →</Link>
                                        </div>
                                    ) : savedTrips.map(trip => (
                                        <TripListItem key={trip.id} trip={trip} mode="saved" />
                                    ))}
                                </div>
                            )}

                            {activeTab === 'badges' && (
                                <div className="card-lg rounded-2xl p-5">
                                    <BadgeGrid earnedBadges={(stats?.badges || []).map((b: any) => b.type)} />
                                </div>
                            )}
                        </>
                    )
                )}
            </div>

            {showFollowersModal && (
                <FollowModal title="Seguidores" list={followers} onClose={() => setShowFollowersModal(false)} />
            )}
            {showFollowingModal && (
                <FollowModal title="Siguiendo" list={following} onClose={() => setShowFollowingModal(false)} />
            )}
        </div>
    );
};