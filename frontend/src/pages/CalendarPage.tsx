import { useEffect, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { tripService } from '../services/tripService';
import { itineraryService } from '../services/itineraryService';
import { ITrip } from '../types/ITrip';
import { DayData } from '../types/calendar';
import { DaySidebar } from '../components/calendar/DaySidebar';
import { DayHeader } from '../components/calendar/DayHeader';
import { DayFlights } from '../components/calendar/DayFlights';
import { DayHotels } from '../components/calendar/DayHotels';
import { ActivityList } from '../components/calendar/ActivityList';

export const CalendarPage = () => {
    const { id: tripId } = useParams<{ id: string }>();
    const { trip } = useOutletContext<{ trip: ITrip | null }>();

    const [days, setDays] = useState<DayData[]>([]);
    const [flights, setFlights] = useState<any[]>([]);
    const [hotels, setHotels] = useState<any[]>([]);
    const [selectedDay, setSelectedDay] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showAddActivity, setShowAddActivity] = useState(false);
    const [editingNotes, setEditingNotes] = useState(false);
    const [notesValue, setNotesValue] = useState('');
    const [titleValue, setTitleValue] = useState('');
    const [newActivity, setNewActivity] = useState({ name: '', type: 'Actividad', time: '09:00', notes: '', amount: '', photo: null as File | null });
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const refreshDays = async () => {
        const tripData = await tripService.getTripById(tripId!);
        setDays([...tripData.itineraries].sort((a: DayData, b: DayData) => a.day - b.day));
    };

    useEffect(() => {
        if (!tripId) return;
        Promise.all([
            tripService.getTripById(tripId),
            itineraryService.getFlights(tripId),
            itineraryService.getHotels(tripId)
        ]).then(([tripData, flightsData, hotelsData]) => {
            const sorted = [...(tripData.itineraries || [])].sort((a: DayData, b: DayData) => a.day - b.day);
            setDays(sorted);
            setFlights(flightsData.flights || []);
            setHotels(hotelsData.hotels || []);
            if (sorted.length > 0) { setNotesValue(sorted[0].notes || ''); setTitleValue(sorted[0].title || ''); }
        }).finally(() => setLoading(false));
    }, [tripId]);

    const currentDay = days[selectedDay];

    const handleSelectDay = (index: number) => {
        setSelectedDay(index);
        setShowAddActivity(false);
        setEditingNotes(false);
        setNotesValue(days[index].notes || '');
        setTitleValue(days[index].title || '');
    };

    const handleAddActivity = async () => {
        if (!newActivity.name || !currentDay) return;
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('name', newActivity.name);
            formData.append('type', newActivity.type);
            formData.append('time', newActivity.time);
            formData.append('notes', newActivity.notes);
            if (newActivity.amount) formData.append('amount', newActivity.amount);
            if (newActivity.photo) formData.append('photo', newActivity.photo);

            const response = await fetch(`/api/trips/itinerary/${currentDay.id}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            if (!response.ok) throw new Error('Error');

            await refreshDays();
            setNewActivity({ name: '', type: 'Actividad', time: '09:00', notes: '', amount: '', photo: null });
            setPhotoPreview(null);
            setShowAddActivity(false);
        } catch { alert('Error al añadir actividad'); }
    };

    const handleDeleteActivity = async (activityId: string) => {
        if (!currentDay) return;
        try {
            await tripService.deleteActivity(currentDay.id, activityId);
            await refreshDays();
        } catch { alert('Error al eliminar actividad'); }
    };

    const handleSaveNotes = async () => {
        if (!currentDay) return;
        try {
            await tripService.updateItineraryNotes(currentDay.id, { notes: notesValue, title: titleValue });
            await refreshDays();
            setEditingNotes(false);
        } catch { alert('Error al guardar notas'); }
    };

    const getDayFlights = () => {
        if (!currentDay) return [];
        const dayDate = new Date(currentDay.date).toDateString();
        return flights.filter(f => new Date(f.departure).toDateString() === dayDate);
    };

    const getDayHotels = () => {
        if (!currentDay) return [];
        const dayDate = new Date(currentDay.date).toDateString();
        return hotels.filter(h => new Date(h.checkIn).toDateString() === dayDate || new Date(h.checkOut).toDateString() === dayDate);
    };

    if (loading) return (
        <div className="flex items-center justify-center py-16 gap-3">
            <div className="spinner" />
            <p className="text-sm text-text-secondary">Cargando calendario...</p>
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 h-full">
            <div className="md:hidden flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                {days.map((day, index) => (
                    <button
                        key={day.id}
                        aria-label={`Seleccionar día ${day.day}`}
                        onClick={() => handleSelectDay(index)}
                        className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition ${
                            selectedDay === index
                                ? 'bg-primary text-white'
                                : 'bg-card border border-border text-text-secondary'
                        }`}
                    >
                        Día {day.day}
                    </button>
                ))}
            </div>

            <div className="hidden md:block">
                <DaySidebar days={days} selectedDay={selectedDay} onSelect={handleSelectDay} />
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto min-w-0">
                {currentDay && (
                    <>
                        <DayHeader
                            day={currentDay}
                            editing={editingNotes}
                            title={titleValue}
                            notes={notesValue}
                            onToggleEdit={() => setEditingNotes(!editingNotes)}
                            onTitleChange={setTitleValue}
                            onNotesChange={setNotesValue}
                            onSave={handleSaveNotes}
                        />
                        <DayFlights flights={getDayFlights()} />
                        <DayHotels hotels={getDayHotels()} currentDate={currentDay.date} />
                        <ActivityList
                            activities={currentDay.activities || []}
                            dayId={currentDay.id}
                            tripId={tripId!}
                            showForm={showAddActivity}
                            newActivity={newActivity}
                            photoPreview={photoPreview}
                            onNewActivityChange={setNewActivity}
                            onPhotoPreviewChange={setPhotoPreview}
                            onAdd={handleAddActivity}
                            onDelete={handleDeleteActivity}
                            onToggleForm={setShowAddActivity}
                            onRefresh={refreshDays}
                        />
                    </>
                )}
            </div>
        </div>
    );
};