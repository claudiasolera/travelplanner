import { useEffect, useState } from 'react';
import { tripService } from '../services/tripService';
import { apiClient } from '../services/apiClient';

type SortBy = 'recent' | 'liked' | 'saved' | 'budget';
type DurationFilter = '' | '1-3' | '4-7' | '8-14' | '15+';
type BudgetFilter = '' | '500' | '1000' | '2000' | '2001+';

export const useCommunity = () => {
    const [trips, setTrips] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<SortBy>('recent');
    const [searchQuery, setSearchQuery] = useState('');
    const [durationFilter, setDurationFilter] = useState<DurationFilter>('');
    const [budgetFilter, setBudgetFilter] = useState<BudgetFilter>('');
    const [likedTrips, setLikedTrips] = useState<Set<string>>(new Set());
    const [savedTrips, setSavedTrips] = useState<Set<string>>(new Set());
    const [followingUsers, setFollowingUsers] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [feedResponse, savedResponse] = await Promise.all([
                    tripService.getExploreFeed(),
                    apiClient('/users/trips/saved')
                ]);
                const data = Array.isArray(feedResponse) ? feedResponse : (feedResponse.trips || []);
                setTrips(data);
                setSavedTrips(new Set((savedResponse.trips || []).map((t: any) => t.id)));
                const likesResponse = await apiClient('/users/likes');
                setLikedTrips(new Set(likesResponse.likedTripIds || []));
                const followingResponse = await apiClient('/users/following');
                setFollowingUsers(new Set(followingResponse.followingIds || []));
            } catch {} finally { setLoading(false); }
        };
        fetchAll();
    }, []);

    const getDaysCount = (start: string, end: string) => {
        return Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)) + 1;
    };

    useEffect(() => {
        let result = [...trips];
        if (searchQuery) {
            result = result.filter(t =>
                t.destination?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.country?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (durationFilter) {
            result = result.filter(t => {
                const days = getDaysCount(t.startDate, t.endDate);
                if (durationFilter === '1-3') return days >= 1 && days <= 3;
                if (durationFilter === '4-7') return days >= 4 && days <= 7;
                if (durationFilter === '8-14') return days >= 8 && days <= 14;
                if (durationFilter === '15+') return days >= 15;
                return true;
            });
        }
        if (budgetFilter) {
            result = result.filter(t => {
                const b = t.budget || 0;
                if (budgetFilter === '500') return b <= 500;
                if (budgetFilter === '1000') return b > 500 && b <= 1000;
                if (budgetFilter === '2000') return b > 1000 && b <= 2000;
                if (budgetFilter === '2001+') return b > 2000;
                return true;
            });
        }
        switch (sortBy) {
            case 'liked': result.sort((a, b) => (b.likes || 0) - (a.likes || 0)); break;
            case 'saved': result.sort((a, b) => (b._count?.savedBy || 0) - (a._count?.savedBy || 0)); break;
            case 'budget': result.sort((a, b) => (a.budget || 0) - (b.budget || 0)); break;
            default: result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        setFiltered(result);
    }, [trips, sortBy, searchQuery, durationFilter, budgetFilter]);

    const clearFilters = () => { setSearchQuery(''); setDurationFilter(''); setBudgetFilter(''); setSortBy('recent'); };

    const handleFollow = async (userId: string) => {
        try {
            if (followingUsers.has(userId)) {
                await apiClient(`/users/unfollow/${userId}`, { method: 'POST' });
                setFollowingUsers(prev => { const s = new Set(prev); s.delete(userId); return s; });
            } else {
                await apiClient(`/users/follow/${userId}`, { method: 'POST' });
                setFollowingUsers(prev => new Set([...prev, userId]));
            }
        } catch {}
    };

    const handleLike = async (tripId: string) => {
        try {
            if (likedTrips.has(tripId)) {
                await tripService.unlikeTrip(tripId);
                setLikedTrips(prev => { const s = new Set(prev); s.delete(tripId); return s; });
                setTrips(prev => prev.map(t => t.id === tripId ? { ...t, likes: (t.likes || 1) - 1 } : t));
            } else {
                await tripService.likeTrip(tripId);
                setLikedTrips(prev => new Set([...prev, tripId]));
                setTrips(prev => prev.map(t => t.id === tripId ? { ...t, likes: (t.likes || 0) + 1 } : t));
            }
        } catch {}
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
        } catch {}
    };

    return {
        filtered, loading,
        searchQuery, setSearchQuery,
        durationFilter, setDurationFilter,
        budgetFilter, setBudgetFilter,
        sortBy, setSortBy,
        likedTrips, savedTrips, followingUsers,
        clearFilters, handleFollow, handleLike, handleSave, getDaysCount
    };
};