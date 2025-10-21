// src/controllers/auth.controller.js
// 요청-응답 처리

import express from 'express';
import { isEmail, isPassword, isUsername } from '../utils/auth.validators.js';
import * as authService from '../services/auth.service.js';

const app = express();

app.use(express.json());

/* ===== Register ===== */
export const register = async (req, res) => {
  // 1) request에서 email, password, username 꺼냄
  let { email, password, username } = req.body;

  if (!isEmail(email) || !isUsername(username)) {
    console.log('email 또는 username이 잘못 입력됨');
    return res.status(400).json({ message: '잘못된 입력 형식입니다.' });
  }

  const user = await authService.register({ email, password, username });

  console.log('✅ Register Success');
  return res.status(201).json({ message: '✅ Register Success', user });
};
