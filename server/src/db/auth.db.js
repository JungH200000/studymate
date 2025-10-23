// src/db/auth.db.js
// db 쿼리 처리
import { query } from './pool.js';

/* ===== Register ===== */
export async function createUser({ email, password_hash, username }) {
  const sql = `
      INSERT INTO users (email, password_hash, username) 
      VALUES ($1, $2, $3)
      RETURNING user_id, email, username, created_at`;
  const params = [email, password_hash, username];

  const { rows } = await query(sql, params);

  return rows[0];
}

/* ===== Login ===== */
export async function findUserByEmail(email) {
  const sql = `
    SELECT user_id, email, password_hash, username
    FROM users
    WHERE lower(email) = lower($1)
    LIMIT 1`;
  const params = [email];

  const { rows } = await query(sql, params);

  return rows[0];
}

export async function createJwt({ jti, user_id, tokenHash, expiresAt }) {
  const sql = `
    INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at)
    VALUES ($1, $2, $3, $4)`;
  const params = [jti, user_id, tokenHash, expiresAt];

  await query(sql, params);
}
