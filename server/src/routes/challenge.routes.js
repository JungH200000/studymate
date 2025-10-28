// src/routes/challenge.routes.js
// `/api/challenges` 라우트

import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { validateCreateChallenges } from '../middleware/challenge.validators.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as challengeController from '../controllers/challenge.controller.js';

const router = express.Router();

router.post('/', requireAuth, validateCreateChallenges, asyncHandler(challengeController.createChallenge));
router.get('/', requireAuth, asyncHandler(challengeController.getChallenges));
router.post('/:id/participants', requireAuth, asyncHandler(challengeController.getParticipation));
router.delete('/:id/participants', requireAuth, asyncHandler(challengeController.deleteParticipation));
export default router;
