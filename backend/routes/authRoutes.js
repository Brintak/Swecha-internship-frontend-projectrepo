const express = require('express');
const { rateLimit } = require('express-rate-limit');
const { authenticate } = require('../middleware/authenticate');
const {
  getSetupStatus,
  bootstrapOwner,
  register,
  login,
  getCurrentUser,
  logout,
} = require('../controllers/authController');

const router = express.Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again later.' },
});

router.get('/setup', getSetupStatus);
router.post('/bootstrap', authLimiter, bootstrapOwner);
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', authenticate, getCurrentUser);
router.post('/logout', authenticate, logout);

module.exports = router;