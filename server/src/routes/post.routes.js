// src/routes/post.routes.js
import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as postController from '../controllers/post.controller.js';

const router = express.Router();

router.post('/:id/posts', requireAuth, asyncHandler(postController.createPost));

export default router;
