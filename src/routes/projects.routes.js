import {Router} from 'express';
import { createP, getP, editP, deleteP, filterP, asignTtoP } from '../handlers/projects.handlers.js';

const router = Router();

router.post('/', createP);
router.get('/', getP);
router.put('/:id', editP);
router.delete('/:id', deleteP);
router.get('/filter', filterP);
router.get('/asign', asignTtoP); // action

export default router;