import prisma from '../config/db.js';

// --- CHECKLIST ---
export const getChecklist = async (req, res) => {
    try {
        const { tripId } = req.params;
        const items = await prisma.tripChecklist.findMany({
            where: { tripId },
            orderBy: { createdAt: 'asc' }
        });
        res.json({ items });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener checklist' });
    }
};

export const addChecklistItem = async (req, res) => {
    try {
        const { tripId } = req.params;
        const { category, text } = req.body;
        const item = await prisma.tripChecklist.create({
            data: { tripId, category, text }
        });
        res.status(201).json({ item });
    } catch (error) {
        res.status(500).json({ error: 'Error al añadir item' });
    }
};

export const toggleChecklistItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const item = await prisma.tripChecklist.findUnique({ where: { id: itemId } });
        const updated = await prisma.tripChecklist.update({
            where: { id: itemId },
            data: { checked: !item.checked }
        });
        res.json({ item: updated });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar item' });
    }
};

export const deleteChecklistItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        await prisma.tripChecklist.delete({ where: { id: itemId } });
        res.json({ message: 'Item eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar item' });
    }
};

// --- TAREAS ---
export const getTasks = async (req, res) => {
    try {
        const { tripId } = req.params;
        const tasks = await prisma.tripTask.findMany({
            where: { tripId },
            orderBy: { createdAt: 'asc' }
        });
        res.json({ tasks });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener tareas' });
    }
};

export const addTask = async (req, res) => {
    try {
        const { tripId } = req.params;
        const { category, text, status, priority } = req.body;
        const task = await prisma.tripTask.create({
            data: { tripId, category, text, status: status || 'Pendiente', priority: priority || 'Media' }
        });
        res.status(201).json({ task });
    } catch (error) {
        res.status(500).json({ error: 'Error al añadir tarea' });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status, priority, text, category } = req.body;
        const task = await prisma.tripTask.update({
            where: { id: taskId },
            data: { status, priority, text, category }
        });
        res.json({ task });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar tarea' });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        await prisma.tripTask.delete({ where: { id: taskId } });
        res.json({ message: 'Tarea eliminada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar tarea' });
    }
};