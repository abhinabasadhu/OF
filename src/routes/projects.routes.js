import {Router} from 'express';
import { createP, getP, editP, deleteP, asignTtoP } from '../handlers/projects.handlers.js';

const router = Router();
// all the routes for the project crud
router.post('/', createP);
router.get('/list', getP);
router.put('/:id', editP);
router.delete('/:id', deleteP);
router.get('/asign', asignTtoP); // action

export default router;