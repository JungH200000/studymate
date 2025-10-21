// src/routes/auth.routes.js
// `/api/auth` 라우트-로그인/회원가입/로그아웃/refresh

import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as authController from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', asyncHandler(authController.register));

export default router;
