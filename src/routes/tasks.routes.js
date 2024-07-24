import {Router} from 'express';
import { createT, getT, editT, deleteT } from '../handlers/tasks.handlers.js';

const router = Router();

// all the routes for the task crud
router.post('/', createT);
router.get('/list', getT);
router.put('/:id', editT);
router.delete('/:id', deleteT);

export default router;