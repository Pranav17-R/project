import { Router } from 'express';
import { body, query } from 'express-validator';
import { listProblems, createProblem } from '../controllers/problem.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.get(
  '/',
  [
    query('tags').optional().isString(),
    query('difficulty').optional().isIn(['Easy', 'Medium', 'Hard']),
    query('platform').optional().isString(),
    query('q').optional().isString(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('page').optional().isInt({ min: 1 })
  ],
  validate,
  listProblems
);

router.post(
  '/',
  requireAuth,
  requireRole('admin'),
  [
    body('problemId').isString().notEmpty(),
    body('title').isString().notEmpty(),
    body('tags').optional().isArray(),
    body('difficulty').isIn(['Easy', 'Medium', 'Hard']),
    body('platform').isString().notEmpty()
  ],
  validate,
  createProblem
);

export default router;





