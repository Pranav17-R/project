import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, logout } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.post(
  '/register',
  [
    body('username').isString().isLength({ min: 3, max: 50 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 })
  ],
  validate,
  register
);

router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').isString().notEmpty()],
  validate,
  login
);

router.post('/logout', logout);

export default router;






