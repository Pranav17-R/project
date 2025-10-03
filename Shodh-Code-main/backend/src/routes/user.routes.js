import { Router } from 'express';
import { body } from 'express-validator';
import { getProfile, updateProfile, changePassword } from '../controllers/user.controller.js';
import { requireAuth } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.get('/me', requireAuth, getProfile);

router.put(
  '/me',
  requireAuth,
  [
    body('username').optional().isString().isLength({ min: 3, max: 50 }),
    body('email').optional().isEmail().normalizeEmail()
  ],
  validate,
  updateProfile
);

router.post(
  '/me/password',
  requireAuth,
  [
    body('currentPassword').isString().notEmpty(),
    body('newPassword').isLength({ min: 6 })
  ],
  validate,
  changePassword
);

export default router;





