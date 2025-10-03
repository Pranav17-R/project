import { Router } from 'express';
import { recommendNext } from '../controllers/recommendation.controller.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.get('/next', requireAuth, recommendNext);

export default router;






