import express from 'express';
import { addEvent, createMatch, getMatch, undoEvent } from '../controllers/matchController';

const router = express.Router();

router.post('/create', createMatch);
router.post('/event', addEvent);
router.get('/:id', getMatch);
router.post('/:matchId/undo', undoEvent);

export default router;
