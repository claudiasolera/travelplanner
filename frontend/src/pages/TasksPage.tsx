import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { checklistService } from '../services/checklistService';

type Tab = 'checklist' | 'tasks';

const CHECKLIST_CATEGORIES = ['Personal', 'Ropa', 'Electrónica', 'Documentación', 'Otros'];
const TASK_CATEGORIES = ['Vuelos', 'Alojamiento', 'Transporte', 'Actividades', 'Documentos', 'Otros'];
const STATUSES = ['Pendiente', 'En progreso', 'Completada'];
const PRIORITIES = ['Alta', 'Media', 'Baja'];

const priorityColor: Record<string, string> = {
    'Alta':  'bg-red-50 text-red-600',
    'Media': 'bg-amber-50 text-amber-600',
    'Baja':  'bg-green-50 text-green-600',
};

const statusColor: Record<string, string> = {
    'Pendiente':   'bg-gray-50 text-gray-500',
    'En progreso': 'bg-primary-light text-primary',
    'Completada':  'bg-green-50 text-green-600',
};

export const TasksPage = () => {
    const { id: tripId } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<Tab>('checklist');

    const [checklist, setChecklist] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('Personal');
    const [newItemText, setNewItemText] = useState('');

    const [tasks, setTasks] = useState<any[]>([]);
    const [showAddTask, setShowAddTask] = useState(false);
    const [newTask, setNewTask] = useState({ category: 'Vuelos', text: '', status: 'Pendiente', priority: 'Media' });

    useEffect(() => {
        if (!tripId) return;
        checklistService.getChecklist(tripId).then(r => setChecklist(r.items || []));
        checklistService.getTasks(tripId).then(r => setTasks(r.tasks || []));
    }, [tripId]);

    const handleAddItem = async () => {
        if (!newItemText.trim() || !tripId) return;
        const r = await checklistService.addItem(tripId, { category: selectedCategory, text: newItemText });
        setChecklist(prev => [...prev, r.item]);
        setNewItemText('');
    };

    const handleToggle = async (itemId: string) => {
        await checklistService.toggleItem(itemId);
        setChecklist(prev => prev.map(i => i.id === itemId ? { ...i, checked: !i.checked } : i));
    };

    const handleDeleteItem = async (itemId: string) => {
        await checklistService.deleteItem(itemId);
        setChecklist(prev => prev.filter(i => i.id !== itemId));
    };

    const handleAddTask = async () => {
        if (!newTask.text.trim() || !tripId) return;
        const r = await checklistService.addTask(tripId, newTask);
        setTasks(prev => [...prev, r.task]);
        setNewTask({ category: 'Vuelos', text: '', status: 'Pendiente', priority: 'Media' });
        setShowAddTask(false);
    };

    const handleUpdateTask = async (taskId: string, field: string, value: string) => {
        await checklistService.updateTask(taskId, { [field]: value });
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, [field]: value } : t));
    };

    const handleDeleteTask = async (taskId: string) => {
        await checklistService.deleteTask(taskId);
        setTasks(prev => prev.filter(t => t.id !== taskId));
    };

    const checklistByCategory = CHECKLIST_CATEGORIES.reduce((acc, cat) => {
        acc[cat] = checklist.filter(i => i.category === cat);
        return acc;
    }, {} as Record<string, any[]>);

    const checkedCount = checklist.filter(i => i.checked).length;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-text">Checklist y Tareas</h1>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-border">
                {[
                    { key: 'checklist', label: 'Checklist' },
                    { key: 'tasks',     label: 'Tareas' },
                ].map(tab => (
                    <button 
                        aria-label={tab.label}
                        key={tab.key} onClick={() => setActiveTab(tab.key as Tab)}
                        className={`px-5 py-2.5 text-sm font-medium rounded-t-xl transition ${
                            activeTab === tab.key
                                ? 'bg-white border border-b-white border-border text-text -mb-px'
                                : 'text-text-secondary hover:text-text'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── CHECKLIST ── */}
            {activeTab === 'checklist' && (
                <div className="space-y-4">
                    {/* Progreso */}
                    <div className="card rounded-2xl p-4">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-sm font-medium text-text">Progreso</p>
                            <p className="text-sm text-text-secondary">{checkedCount}/{checklist.length} completados</p>
                        </div>
                        <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all"
                                style={{ width: checklist.length > 0 ? `${(checkedCount / checklist.length) * 100}%` : '0%' }}/>
                        </div>
                    </div>

                    {/* Añadir item */}
                    <div className="bg-card rounded-2xl p-4 flex flex-col sm:flex-row gap-3 sm:items-end"
                        style={{ border: '2px solid white', boxShadow: '0 4px 16px rgba(201,176,160,0.3)' }}>
                        <div className="w-full sm:w-40">
                            <label className="label">Categoría</label>
                            <select 
                                aria-label="Categoría para nuevo item"
                                className="input px-4 py-2.5 w-full" 
                                value={selectedCategory}
                                onChange={e => setSelectedCategory(e.target.value)}
                            >
                                {CHECKLIST_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="label">Item</label>
                            <input 
                                aria-label="Nuevo item para checklist"
                                className="input px-4 py-2.5 w-full"
                                placeholder="Ej: Pasaporte, cargador..."
                                value={newItemText}
                                onChange={e => setNewItemText(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddItem()} 
                            />
                        </div>
                        <button 
                            aria-label="Añadir Item"
                            onClick={handleAddItem} 
                            className="btn text-sm py-2.5 px-4 w-full sm:w-auto"
                        >
                            + Añadir
                        </button>
                    </div>

                    {/* Items por categoría */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {CHECKLIST_CATEGORIES.map(cat => (
                            <div key={cat} className="card rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-7 h-7 bg-primary-light rounded-xl flex items-center justify-center">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                                            <rect x="4" y="3" width="16" height="18" rx="2"/>
                                            <path d="M9 7h6M9 11h6M9 15h4"/>
                                        </svg>
                                    </div>
                                    <p className="text-sm font-semibold text-text">{cat}</p>
                                    <span className="text-xs text-text-soft ml-auto">
                                        {checklistByCategory[cat].filter(i => i.checked).length}/{checklistByCategory[cat].length}
                                    </span>
                                </div>

                                {checklistByCategory[cat].length === 0 ? (
                                    <p className="text-xs text-text-soft text-center py-3">Sin items</p>
                                ) : (
                                    <div className="space-y-2">
                                        {checklistByCategory[cat].map(item => (
                                            <div key={item.id} className="flex items-center gap-2 group">
                                                <button 
                                                    aria-label={item.checked ? "Desmarcar item" : "Marcar item"}
                                                    onClick={() => handleToggle(item.id)}
                                                    className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition ${
                                                        item.checked ? 'bg-primary border-primary' : 'border-border hover:border-primary'
                                                    }`}
                                                >
                                                    {item.checked && (
                                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                                            <path d="M5 13l4 4L19 7" strokeLinecap="round"/>
                                                        </svg>
                                                    )}
                                                </button>
                                                <span className={`text-sm flex-1 ${item.checked ? 'line-through text-text-soft' : 'text-text'}`}>
                                                    {item.text}
                                                </span>
                                                <button 
                                                    aria-label="Eliminar item"
                                                    onClick={() => handleDeleteItem(item.id)}
                                                    className="text-text-soft hover:text-red-400 transition opacity-0 group-hover:opacity-100"
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── TAREAS ── */}
            {activeTab === 'tasks' && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-text-secondary">{tasks.length} tareas en total</p>
                        <button 
                            aria-label="Agregar nueva tarea"
                            onClick={() => setShowAddTask(true)} 
                            className="btn text-sm py-2 px-4"
                        >
                            + Nueva tarea
                        </button>
                    </div>

                    {showAddTask && (
                        <div className="card rounded-2xl p-5 space-y-3"
                            style={{ border: '2px solid white', boxShadow: '0 4px 16px rgba(201,176,160,0.3)' }}>
                            <div className="flex gap-3 flex-wrap">
                                <div className="flex-1 min-w-48">
                                    <label className="label">Tarea</label>
                                    <input 
                                        aria-label="Nueva tarea"
                                        className="input px-4 py-2.5" 
                                        placeholder="Ej: Reservar vuelo de vuelta"
                                        value={newTask.text}
                                        onChange={e => setNewTask({ ...newTask, text: e.target.value })} 
                                    />
                                </div>
                                <div className="min-w-32">
                                    <label className="label">Categoría</label>
                                    <select 
                                        aria-label="Categoría de la tarea"
                                        className="input px-4 py-2.5" value={newTask.category}
                                        onChange={e => setNewTask({ ...newTask, category: e.target.value })}
                                    >
                                        {TASK_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="min-w-28">
                                    <label className="label">Prioridad</label>
                                    <select 
                                        aria-label="Prioridad de la tarea"
                                        className="input px-4 py-2.5" value={newTask.priority}
                                        onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                                    >
                                        {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    aria-label="Guardar tarea"
                                    onClick={handleAddTask} 
                                    className="btn text-xs py-1.5 px-4"
                                >
                                    Guardar
                                </button>
                                <button 
                                    aria-label="Cancelar"
                                    onClick={() => setShowAddTask(false)}
                                    className="text-xs text-text-soft hover:text-text px-3 py-1.5"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}

                    {tasks.length === 0 ? (
                        <div className="empty-state rounded-2xl">
                            <p className="text-text-soft text-sm">No hay tareas todavía.</p>
                        </div>
                    ) : (
                        <>
                            <div className="hidden sm:block card rounded-2xl overflow-hidden"
                                style={{ border: '2px solid white', boxShadow: '0 4px 16px rgba(201,176,160,0.3)' }}>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-text-soft uppercase tracking-wide">Tarea</th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-text-soft uppercase tracking-wide">Categoría</th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-text-soft uppercase tracking-wide">Estado</th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-text-soft uppercase tracking-wide">Prioridad</th>
                                            <th className="px-4 py-3"/>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasks.map((task, i) => (
                                            <tr key={task.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? '' : 'bg-bg'}`}>
                                                <td className="px-4 py-3 text-text font-medium">{task.text}</td>
                                                <td className="px-4 py-3 text-text-secondary">{task.category}</td>
                                                <td className="px-4 py-3">
                                                    <select aria-label="Estado" className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer ${statusColor[task.status]}`}
                                                        value={task.status} onChange={e => handleUpdateTask(task.id, 'status', e.target.value)}>
                                                        {STATUSES.map(s => <option key={s}>{s}</option>)}
                                                    </select>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <select aria-label="Prioridad" className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer ${priorityColor[task.priority]}`}
                                                        value={task.priority} onChange={e => handleUpdateTask(task.id, 'priority', e.target.value)}>
                                                        {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                                                    </select>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button aria-label="Eliminar tarea" onClick={() => handleDeleteTask(task.id)}
                                                        className="text-text-soft hover:text-red-400 transition">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round"/>
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="sm:hidden space-y-3">
                                {tasks.map(task => (
                                    <div key={task.id} className="card rounded-2xl p-4 space-y-2"
                                        style={{ border: '2px solid white', boxShadow: '0 4px 16px rgba(201,176,160,0.3)' }}>
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="text-sm font-medium text-text">{task.text}</p>
                                            <button aria-label="Eliminar tarea" onClick={() => handleDeleteTask(task.id)}
                                                className="text-text-soft hover:text-red-400 transition shrink-0">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round"/>
                                                </svg>
                                            </button>
                                        </div>
                                        <p className="text-xs text-text-secondary">{task.category}</p>
                                        <div className="flex gap-2">
                                            <select aria-label="Estado" className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer ${statusColor[task.status]}`}
                                                value={task.status} onChange={e => handleUpdateTask(task.id, 'status', e.target.value)}>
                                                {STATUSES.map(s => <option key={s}>{s}</option>)}
                                            </select>
                                            <select aria-label="Prioridad" className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer ${priorityColor[task.priority]}`}
                                                value={task.priority} onChange={e => handleUpdateTask(task.id, 'priority', e.target.value)}>
                                                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};