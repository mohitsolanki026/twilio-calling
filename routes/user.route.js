import express from 'express';
import userCtrl from '../controllers/user.controller.js';
import auth from '../middleware/user.auth.js';

const router = express.Router();

router.post('/auth', userCtrl.getToken);
router.post('/create-task', auth, userCtrl.createTask);
router.post('/create-subtask', auth, userCtrl.createSubTask);
router.get('/get-tasks', auth, userCtrl.getTasks);
router.get('/get-subTask', auth, userCtrl.getSubTasks);
router.put('/update-task/:id', auth, userCtrl.updateTask);
router.put('/update-subTask/:id', auth, userCtrl.updateSubTask);
router.delete('/delete-task/:id', auth, userCtrl.deleteTask);
router.delete('/delete-subTask/:id', auth, userCtrl.deleteSubTask);

export default router;