// src/routes/users.routes.js
import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.get('/:id', requireAuth, asyncHandler(userController.getUserInfo));
router.get('/:id/challenges', requireAuth, asyncHandler(userController.getChallengesByUser));
router
  .route('/:id/follows')
  .post(requireAuth, asyncHandler(userController.postFollow))
  .delete(requireAuth, asyncHandler(userController.deleteFollow));
router.get('/:id/followers', requireAuth, asyncHandler(userController.getFollowerList));
router.get('/:id/followings', requireAuth, asyncHandler(userController.getFollowingList));

export default router;
