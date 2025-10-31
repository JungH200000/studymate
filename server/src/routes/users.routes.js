// src/routes/users.routes.js
import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.get('/:id', requireAuth, asyncHandler(userController.getUserInfo));
router.get('/:id/challenges', requireAuth, asyncHandler(userController.getChallengesByUser));

export default router;
