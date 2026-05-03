import { useEffect, useState } from 'react';
import { checklistService } from '../services/checklistService';

const CHECKLIST_CATEGORIES = ['Personal', 'Ropa', 'Electrónica', 'Documentación', 'Otros'];

export const useTasks = (tripId: string | undefined) => {
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

    return {
        checklist, selectedCategory, setSelectedCategory, newItemText, setNewItemText,
        tasks, showAddTask, setShowAddTask, newTask, setNewTask,
        handleAddItem, handleToggle, handleDeleteItem,
        handleAddTask, handleUpdateTask, handleDeleteTask,
        checklistByCategory, checkedCount
    };
};