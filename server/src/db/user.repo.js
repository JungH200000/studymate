// src/db/user.repo.js
// db 쿼리 처리
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
