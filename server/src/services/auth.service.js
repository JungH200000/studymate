// src/services/auth.service.js
// 비지니스 로직
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import * as authDB from '../db/auth.db.js';
import { signAccess, signRefresh } from '../utils/jwt.js';

/* ===== Register ===== */
export async function register({ email, password, username }) {
  // 1) 정규화
  const normalizedEmail = email.toLowerCase().trim();
  const normalizedUsername = username.trim();
  const password_hash = await bcrypt.hash(password, 10);

  // 2) query 처리
  try {
    const user = await authDB.createUser({ email: normalizedEmail, password_hash, username: normalizedUsername });
    return user;
  } catch (error) {
    // 중복(unique) 오류 처리
    if (error.code === '23505') {
      console.log('[중복 Error] \n', error);
      const err = new Error(
        // err.message에 담김
        (error.detail?.includes('email') && '이미 사용 중인 email입니다.') ||
          (error.detail?.includes('username') && '이미 사용 중인 username입니다.') ||
          '이미 사용 중인 값이 있습니다.'
      );
      err.status = 409;
      throw err;
    }
    throw error;
  }
}

/* ===== Login ===== */
export async function login({ email, password }) {
  const normalizedEmail = String(email).toLowerCase().trim();

  try {
    // 1) email db에 조회
    const user = await authDB.findUserByEmail(normalizedEmail);
    if (!user) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      throw err;
    }

    // 2) password 비교
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      throw err;
    }

    // 3) JWT 발급
    const jti = randomUUID();
    const accessToken = signAccess({ sub: user.user_id, email: user.email });
    const refreshToken = signRefresh({ sub: user.user_id, jti });

    // 4) expiresAt(만료 시간) 계산
    const decoded = jwt.decode(refreshToken); // 서명 검증 x, 디코딩만
    //exp(만료 시간) -> 밀리초 단위로 변환
    const expMs = decoded?.exp ? decoded.exp * 1000 : Date.now() + 7 * 24 * 60 * 60 * 1000;
    const expiresAt = new Date(expMs);

    // 5) refresh token hash
    const tokenHash = await bcrypt.hash(refreshToken, 10);

    // 6) refresh token db에 저장
    await authDB.createJwt({ jti, user_id: user.user_id, tokenHash, expiresAt });

    return { user, accessToken, refreshToken, expMs };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
