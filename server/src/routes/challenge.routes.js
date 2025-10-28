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
router
  .route('/:id/participants')
  .post(requireAuth, asyncHandler(challengeController.postParticipation))
  .delete(requireAuth, asyncHandler(challengeController.deleteParticipation));
router
  .route('/:id/likes')
  .post(requireAuth, asyncHandler(challengeController.postLike))
  .delete(requireAuth, asyncHandler(challengeController.deleteLike));

export default router;
