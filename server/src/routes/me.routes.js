// src/routes/me.routes.js
import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.get('/', requireAuth, asyncHandler(userController.getMyInfo));
router.get('/challenges', requireAuth, asyncHandler(userController.getChallengesByMe));

export default router;
