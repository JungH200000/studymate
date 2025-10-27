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

    // 4) expiresAt (만료 시간) 계산
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

/* ===== Refresh ===== */
export async function refresh({ refreshToken }) {
  // 1) 서명/만료 검증
  const { sub: user_id, jti } = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

  // 2) DB 세션 조회
  const session = await authDB.findRefreshById(jti);
  if (!session || session.user_id !== user_id) {
    const error = new Error('세션을 찾을 수 없습니다.');
    error.status = 401;
    throw error;
  }

  // 3) 만료/폐기 여부 확인
  if (session.revoked_at) {
    const error = new Error('이미 만료된 세션입니다.');
    error.status = 401;
    throw error;
  }
  if (new Date(session.expires_at).getTime() <= Date.now()) {
    await authDB.revokeRefreshById(session.id);

    const error = new Error('세션이 만료되었습니다.');
    error.status = 401;
    throw error;
  }

  // 4) token hash 일치 확인
  const same = await bcrypt.compare(refreshToken, session.token_hash);
  if (!same) {
    await authDB.revokeRefreshById(session.id);

    const error = new Error('유효하지 않는 세션입니다.');
    error.status = 401;
    throw error;
  }

  // 5) JWT 발급
  const user = await authDB.findUserById(session.user_id);
  if (!user) {
    const error = new Error('사용자를 찾을 수 없습니다.');
    error.status = 401;
    throw error;
  }

  const newJti = randomUUID();
  const newAccessToken = signAccess({ sub: user.user_id, email: user.email });
  const newRefreshToken = signRefresh({ sub: user.user_id, jti: newJti });

  // 6) expiresAt(만료 시간) 계산
  const newDecoded = jwt.decode(newRefreshToken);
  const expMs = newDecoded?.exp ? newDecoded.exp * 1000 : Date.now() + 7 * 24 * 60 * 60 * 1000;
  const expiresAt = new Date(expMs);

  // 7) refresh token hash
  const newTokenHash = await bcrypt.hash(newRefreshToken, 10);

  // 8) db 저장 및 이전 세션 폐기
  await authDB.createJwt({ jti: newJti, user_id: user.user_id, tokenHash: newTokenHash, expiresAt });
  await authDB.revokeRefreshById(jti);

  return { user, accessToken: newAccessToken, refreshToken: newRefreshToken, expMs };
}

/* ===== Logout ===== */
export async function logout({ refreshToken }) {
  try {
    const { jti } = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    await authDB.revokeRefreshById(jti);
  } catch (error) {}
  return true;
}
