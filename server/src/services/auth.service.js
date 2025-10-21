// src/services/auth.service.js
// 비지니스 로직
import bcrypt from 'bcrypt';
import * as userRepo from '../db/user.repo.js';

/* ===== Register ===== */
export async function register({ email, password, username }) {
  const normalizedEmail = email.toLowerCase().trim();
  const normalizedUsername = username.trim();
  const password_hash = await bcrypt.hash(password, 10);

  try {
    const user = await userRepo.createUser({ email: normalizedEmail, password_hash, username: normalizedUsername });
    return user;
  } catch (error) {
    // 중복(unique) 오류 처리
    if (error.code === '23505') {
      console.log('[중복 Error] \n', error);
      const err = new Error('이미 사용 중인 값이 있습니다.');
      err.status = 409;
      throw err;
    }
    throw error;
  }
}
