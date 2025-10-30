// src/routes/report.routes.js
import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as reportController from '../controllers/report.controller.js';

const router = express.Router();

router.post('/challenges/:id', requireAuth, asyncHandler(reportController.createChallengeReport));
router.post('/posts/:id', requireAuth, asyncHandler(reportController.createPostReport));

export default router;
