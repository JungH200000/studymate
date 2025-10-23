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

/* ===== Login ===== */
export const login = async (req, res) => {
  // 1) request에서 email, password, username 꺼냄
  const { email, password } = req.body;

  // 2) email, password를 입력했는지 검증
  if (!email || !password) {
    const err = new Error('email이나 password를 입력하지 않았습니다.');
    err.status = 400;
    throw err;
  }

  // 3) email, password 검증 및 query 처리
  const { user, accessToken, refreshToken, expMs } = await authService.login({ email, password });

  // 4) cookie로 refresh token 전달 (매번 DB에 조회하지 않기 위해)
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true, // js로 cookie 접근 불가
    sameSite: 'lax', // 다른 사이트에서 해당 사이트로 HTTP 요청 방지 기능
    secure: false, // true -> https만 허용
    expires: new Date(expMs), // JWT 만료
    path: '/api/auth',
  });

  // 5) 관련 정보(access token 포함) Frontend로 전송
  return res.status(200).json({
    ok: true,
    message: '로그인에 성공했습니다.',
    accessToken,
    user: { id: user.user_id, email: user.email, username: user.username },
  });
};

/* ===== Refresh ===== */
export const refresh = async (req, res) => {
  // console.log(req.cookies);
  const token = req.cookies?.refresh_token;
  if (!token) {
    const error = new Error('refresh token이 없습니다.');
    error.status = 401;
    throw error;
  }

  const { user, accessToken, refreshToken, expMs } = await authService.refresh({ refreshToken: token });

  // new cookie
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    expires: new Date(expMs),
    path: '/api/auth',
  });

  return res.status(200).json({
    ok: true,
    message: '토큰이 재발급 되었습니다.',
    accessToken,
    user: { id: user.user_id, email: user.email, username: user.username },
  });
};

/* ===== Logout ===== */
export const logout = async (req, res) => {
  const token = req.cookies?.refresh_token;
  if (token) {
    await authService.logout({ refreshToken: token });
  }

  // cookie 제거
  res.clearCookie('refresh_token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/api/auth',
  });

  return res.status(200).json({ ok: true, message: '로그아웃 되었습니다.' });
};
