import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { getChecklist, addChecklistItem, toggleChecklistItem, deleteChecklistItem, getTasks, addTask, updateTask, deleteTask } from '../controllers/checklistController.js';

const router = express.Router();

router.get('/:tripId/checklist', authenticateToken, getChecklist);
router.post('/:tripId/checklist', authenticateToken, addChecklistItem);
router.patch('/checklist/:itemId/toggle', authenticateToken, toggleChecklistItem);
router.delete('/checklist/:itemId', authenticateToken, deleteChecklistItem);

router.get('/:tripId/tasks', authenticateToken, getTasks);
router.post('/:tripId/tasks', authenticateToken, addTask);
router.patch('/tasks/:taskId', authenticateToken, updateTask);
router.delete('/tasks/:taskId', authenticateToken, deleteTask);

export default router;