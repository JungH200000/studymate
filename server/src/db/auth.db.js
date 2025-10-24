// src/db/auth.db.js
// db query 처리
import { query } from './pool.js';

export async function createUser({ email, password_hash, username }) {
  const sql = `
      INSERT INTO users (email, password_hash, username) 
      VALUES ($1, $2, $3)
      RETURNING user_id, email, username, created_at`;
  const params = [email, password_hash, username];

  const { rows } = await query(sql, params);

  return rows[0];
}

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

export async function findRefreshById(id) {
  const sql = `
    SELECT id, user_id, token_hash, created_at, expires_at, revoked_at
    FROM refresh_tokens
    WHERE id = $1
    LIMIT 1`;
  const params = [id];

  const { rows } = await query(sql, params);

  return rows[0];
}

export async function revokeRefreshById(id) {
  const sql = `
    UPDATE refresh_tokens 
    SET revoked_at = now()
    WHERE id = $1 AND revoked_at IS NULL`;
  const params = [id];

  await query(sql, params);
}

export async function findUserById(user_id) {
  const sql = `
    SELECT user_id, email, username
    FROM users
    WHERE user_id = $1
    LIMIT 1`;
  const params = [user_id];

  const { rows } = await query(sql, params);

  return rows[0];
}
