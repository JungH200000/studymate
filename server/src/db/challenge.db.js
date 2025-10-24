// src/db/challenge.db.js
// db query 처리
import { query } from './pool.js';

export async function createChallenge({
  title,
  content,
  frequency_type,
  target_per_week,
  start_date,
  end_date,
  creator_id,
}) {
  const sql = `
    INSERT INTO challenges (title, content, frequency_type, target_per_week, start_date, end_date, creator_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING challenge_id, title, content, frequency_type, target_per_week, to_char(start_date, 'YYYY-MM-DD') AS start_date, to_char(end_date, 'YYYY-MM-DD') AS end_date, created_at, creator_id`;
  const params = [title, content, frequency_type, target_per_week, start_date, end_date, creator_id];

  const { rows } = await query(sql, params);

  return rows[0];
}
