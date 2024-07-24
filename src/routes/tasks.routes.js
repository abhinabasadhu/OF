import {Router} from 'express';
import { createT, getT, editT, deleteT } from '../handlers/tasks.handlers.js';

const router = Router();

router.post('/', createT);
router.get('/list', getT);
router.put('/:id', editT);
router.delete('/:id', deleteT);

export default router;