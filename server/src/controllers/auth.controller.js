// src/controllers/auth.controller.js
// 요청-응답 처리
import { isEmail, isPassword, isUsername } from '../utils/auth.validators.js';
import * as authService from '../services/auth.service.js';

/* ===== Register ===== */
export const register = async (req, res) => {
  // 1) request에서 email, password, username 꺼냄
  let { email, password, username } = req.body;

  // 2) email, password, username이 유효한 형식인지 검증
  if (!isEmail(email) || !isUsername(username) || !isPassword(password)) {
    const err = new Error('잘못된 입력 형식입니다.');
    err.status = 400;
    throw err;
  }

  // 3) 정규화 및 query 처리
  const user = await authService.register({ email, password, username });

  console.log('✅ Register Success');
  return res.status(201).json({ ok: true, message: '✅ Register Success', user });
};
