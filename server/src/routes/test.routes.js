import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

router.get('/profile', requireAuth, (req, res) => {
  res.json({
    ok: true,
    message: 'test: 인증 성공!!!',
    user: req.user,
  });
});

export default router;
