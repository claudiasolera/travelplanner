import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripService } from '../services/tripService';
import { apiClient } from '../services/apiClient';

export const usePublicTrip = (id: string | undefined) => {
    const navigate = useNavigate();

    const [trip, setTrip] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [showCloneModal, setShowCloneModal] = useState(false);
    const [cloneStart, setCloneStart] = useState('');
    const [cloneEnd, setCloneEnd] = useState('');
    const [cloning, setCloning] = useState(false);
    const [activeDay, setActiveDay] = useState<number | null>(null);
    const [activeSection, setActiveSection] = useState<'itinerary' | 'hotels' | 'places' | 'expenses' | 'tips'>('itinerary');

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const data = await tripService.getPublicTrip(id!);
                setTrip(data);
                setIsLiked(data.isLiked || false);
                setIsSaved(data.isSaved || false);
            } catch {
                navigate('/community');
            } finally {
                setLoading(false);
            }
        };
        fetchTrip();
    }, [id]);

    const getDays = (start: string, end: string) =>
        Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const handleLike = async () => {
        try {
            if (isLiked) {
                await tripService.unlikeTrip(id!);
                setIsLiked(false);
                setTrip((t: any) => ({ ...t, _count: { ...t._count, likes: t._count.likes - 1 } }));
            } else {
                await tripService.likeTrip(id!);
                setIsLiked(true);
                setTrip((t: any) => ({ ...t, _count: { ...t._count, likes: t._count.likes + 1 } }));
            }
        } catch {}
    };

    const handleSave = async () => {
        try {
            if (isSaved) {
                await tripService.unsaveTrip(id!);
                setIsSaved(false);
            } else {
                await tripService.saveTrip(id!);
                setIsSaved(true);
            }
        } catch {}
    };

    const handleComment = async () => {
        if (!newComment.trim()) return;
        setCommentsLoading(true);
        try {
            await apiClient(`/trips/${id}/comments`, {
                method: 'POST',
                body: JSON.stringify({ content: newComment })
            });
            setNewComment('');
            const data = await tripService.getPublicTrip(id!);
            setTrip(data);
        } catch {} finally {
            setCommentsLoading(false);
        }
    };

    const handleClone = async () => {
        if (!cloneStart || !cloneEnd) return;
        setCloning(true);
        try {
            const { trip: cloned } = await tripService.cloneTrip(id!, cloneStart, cloneEnd);
            navigate(`/trip/${cloned.id}`);
        } catch {} finally {
            setCloning(false);
        }
    };

    const getTotalExpenses = () => {
        if (!trip) return 0;
        const flights = trip.flights?.reduce((acc: number, f: any) => acc + (f.price || 0), 0) || 0;
        const hotels = trip.hotels?.reduce((acc: number, h: any) => acc + (h.price || 0), 0) || 0;
        const manual = trip.expenses?.reduce((acc: number, e: any) => acc + (e.amount || 0), 0) || 0;
        let activities = 0;
        (trip.itineraries || []).forEach((day: any) => {
            (Array.isArray(day.activities) ? day.activities : []).forEach((act: any) => {
                if (act.amount) activities += parseFloat(act.amount) || 0;
            });
        });
        return flights + hotels + manual + activities;
    };

    return {
        trip, loading, navigate,
        showComments, setShowComments, newComment, setNewComment, commentsLoading,
        isLiked, isSaved, showCloneModal, setShowCloneModal,
        cloneStart, setCloneStart, cloneEnd, setCloneEnd, cloning,
        activeDay, setActiveDay, activeSection, setActiveSection,
        getDays, handleLike, handleSave, handleComment, handleClone, getTotalExpenses
    };
};