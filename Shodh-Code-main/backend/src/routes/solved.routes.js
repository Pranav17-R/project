import { Router } from 'express';
import { body, query } from 'express-validator';
import { addSolved, listSolved, deleteSolved } from '../controllers/solved.controller.js';
import { requireAuth } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.post(
  '/',
  requireAuth,
  [
    body('problemId').isString().notEmpty(),
    body('title').isString().notEmpty(),
    body('tags').optional().isArray(),
    body('dateSolved').optional().isISO8601(),
    body('difficulty').isIn(['Easy', 'Medium', 'Hard']),
    body('platform').isString().notEmpty()
  ],
  validate,
  addSolved
);

router.get(
  '/',
  requireAuth,
  [
    query('tags').optional().isString(),
    query('difficulty').optional().isIn(['Easy', 'Medium', 'Hard']),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('page').optional().isInt({ min: 1 })
  ],
  validate,
  listSolved
);

router.delete(
  '/:id',
  requireAuth,
  deleteSolved
);

export default router;






