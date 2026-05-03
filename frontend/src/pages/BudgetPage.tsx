import { useEffect, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { itineraryService } from '../services/itineraryService';
import { tripService } from '../services/tripService';
import { ITrip } from '../types/ITrip';
import { DonutChart } from '../components/budget/DonutChart';
import { CategoryBreakdown } from '../components/budget/CategoryBreakdown';
import { TransactionList } from '../components/budget/TransactionList';
import { AddExpenseModal } from '../components/budget/AddExpenseModal';

interface Expense {
    id: string; category: string; name: string; amount: number; date: string;
}

const CATEGORIES = ['Vuelos', 'Hoteles', 'Comida', 'Actividades', 'Transporte', 'Compras', 'Otros'];

export const BudgetPage = () => {
    const { id: tripId } = useParams<{ id: string }>();
    const { trip } = useOutletContext<{ trip: ITrip | null }>();

    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [flights, setFlights] = useState<any[]>([]);
    const [hotels, setHotels] = useState<any[]>([]);
    const [activityExpenses, setActivityExpenses] = useState<any[]>([]);
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [newExpense, setNewExpense] = useState({ category: 'Comida', name: '', amount: '', date: '' });
    const [savingExpense, setSavingExpense] = useState(false);

    const budget = trip?.budget || 0;

    useEffect(() => {
        if (!tripId) return;

        itineraryService.getFlights(tripId).then(r => setFlights(r.flights || []));
        itineraryService.getHotels(tripId).then(r => setHotels(r.hotels || []));

        tripService.getTripById(tripId).then((data: any) => {
            const acts: any[] = [];
            (data.itineraries || []).forEach((day: any) => {
                (Array.isArray(day.activities) ? day.activities : []).forEach((act: any) => {
                    if (act.amount) {
                        acts.push({
                            id: act.id, name: act.name,
                            category: act.type === 'Restaurante' ? 'Comida' : act.type === 'Compras' ? 'Compras' : 'Actividades',
                            amount: act.amount, date: day.date, fixed: true
                        });
                    }
                });
            });
            setActivityExpenses(acts);
        });

        tripService.getExpenses(tripId)
            .then(async (data: any) => {
                const dbExpenses = Array.isArray(data) ? data : [];
                if (dbExpenses.length === 0) {
                    const saved = localStorage.getItem(`expenses_${tripId}`);
                    if (saved) {
                        const localData: any[] = JSON.parse(saved);
                        if (localData.length > 0) {
                            const results = await Promise.allSettled(
                                localData.map(e => tripService.addExpense(tripId, {
                                    category: e.category || 'Otros', name: e.description || e.name || 'Gasto',
                                    amount: e.amount, date: e.date || undefined,
                                }))
                            );
                            const migrated = results.filter(r => r.status === 'fulfilled').map((r: any) => r.value);
                            setExpenses(migrated);
                            if (migrated.length > 0) localStorage.removeItem(`expenses_${tripId}`);
                            return;
                        }
                    }
                }
                setExpenses(dbExpenses);
            })
            .catch(() => {
                const saved = localStorage.getItem(`expenses_${tripId}`);
                if (saved) setExpenses(JSON.parse(saved).map((e: any) => ({ ...e, name: e.name || e.description || 'Gasto' })));
            });
    }, [tripId]);

    const handleAddExpense = async () => {
        if (!newExpense.name || !newExpense.amount || !tripId) return;
        setSavingExpense(true);
        try {
            const created = await tripService.addExpense(tripId, {
                category: newExpense.category, name: newExpense.name,
                amount: parseFloat(newExpense.amount), date: newExpense.date || undefined,
            });
            setExpenses(prev => [...prev, created]);
            setNewExpense({ category: 'Comida', name: '', amount: '', date: '' });
            setShowAddExpense(false);
        } catch {} finally { setSavingExpense(false); }
    };

    const handleDeleteExpense = async (id: string) => {
        if (!tripId) return;
        try {
            await tripService.deleteExpense(tripId, id);
            setExpenses(prev => prev.filter(e => e.id !== id));
        } catch {}
    };

    const flightsTotal = flights.reduce((acc, f) => acc + (f.price || 0), 0);
    const hotelsTotal = hotels.reduce((acc, h) => acc + (h.price || 0), 0);
    const expensesTotal = expenses.reduce((acc, e) => acc + e.amount, 0);
    const activitiesTotal = activityExpenses.reduce((acc: number, a: any) => acc + a.amount, 0);
    const totalSpent = flightsTotal + hotelsTotal + expensesTotal + activitiesTotal;
    const remaining = budget - totalSpent;

    const tripDays = trip?.startDate && trip?.endDate
        ? Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
        : 1;
    const dailyAvg = totalSpent / tripDays;

    const byCategory = CATEGORIES.map(cat => {
        let total = 0;
        if (cat === 'Vuelos') total = flightsTotal;
        else if (cat === 'Hoteles') total = hotelsTotal;
        else {
            total = expenses.filter(e => e.category === cat).reduce((acc, e) => acc + e.amount, 0)
                + activityExpenses.filter((a: any) => a.category === cat).reduce((acc: number, a: any) => acc + a.amount, 0);
        }
        return { category: cat, total };
    }).filter(c => c.total > 0);

    const allTransactions = [
        ...flights.map(f => ({ id: f.id, name: `${f.originCity} → ${f.destCity}`, category: 'Vuelos', amount: f.price || 0, date: f.departure, fixed: true })),
        ...hotels.map(h => ({ id: h.id, name: h.name, category: 'Hoteles', amount: h.price || 0, date: h.checkIn, fixed: true })),
        ...expenses.map(e => ({ ...e, fixed: false })),
        ...activityExpenses
    ].sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-text">Presupuesto</h1>
                <button aria-label="Añadir gasto" onClick={() => setShowAddExpense(true)} className="btn text-sm py-2 px-4">
                    + Añadir gasto
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card-lg rounded-2xl p-5 flex flex-col items-center justify-center">
                    <DonutChart spent={totalSpent} budget={budget} />
                    <div className="flex gap-4 mt-4 text-center">
                        <div>
                            <p className="text-xs text-text-soft">Restante</p>
                            <p className={`text-sm font-bold ${remaining < 0 ? 'text-red-500' : 'text-green-600'}`}>
                                {remaining < 0 ? `-${Math.abs(remaining).toFixed(0)}€` : `${remaining.toFixed(0)}€`}
                            </p>
                        </div>
                        <div className="w-px bg-border" />
                        <div>
                            <p className="text-xs text-text-soft">Media diaria</p>
                            <p className="text-sm font-bold text-text">{dailyAvg.toFixed(0)}€/día</p>
                        </div>
                    </div>
                </div>
                <CategoryBreakdown categories={byCategory} totalSpent={totalSpent} />
            </div>

            <TransactionList transactions={allTransactions} onDelete={handleDeleteExpense} />

            {showAddExpense && (
                <AddExpenseModal
                    expense={newExpense}
                    saving={savingExpense}
                    categories={CATEGORIES}
                    onChange={setNewExpense}
                    onSave={handleAddExpense}
                    onClose={() => setShowAddExpense(false)}
                />
            )}
        </div>
    );
};