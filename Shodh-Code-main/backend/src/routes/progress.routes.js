import { Router } from 'express';
import { summary, timeline } from '../controllers/progress.controller.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.get('/summary', requireAuth, summary);
router.get('/timeline', requireAuth, timeline);

export default router;






