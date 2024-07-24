import {Router} from 'express';
import { createT, getT, editT, deleteT, filterT } from '../handlers/tasks.handlers.js';

const router = Router();

router.post('/', createT);
router.get('/', getT);
router.put('/:id', editT);
router.delete('/:id', deleteT);
router.get('/filter', filterT);

export default router;