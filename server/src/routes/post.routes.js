// src/routes/post.routes.js
import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as postController from '../controllers/post.controller.js';

const router = express.Router();

router
  .route('/:id/posts')
  .post(requireAuth, asyncHandler(postController.createPost))
  .get(requireAuth, asyncHandler(postController.getPosts));
router
  .route('/posts/:id/cheers')
  .post(requireAuth, asyncHandler(postController.postCheer))
  .delete(requireAuth, asyncHandler(postController.deleteCheer));

export default router;
