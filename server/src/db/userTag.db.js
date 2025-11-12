// src/db/userTag.db.js
// tag db에 등록
import { query } from './pool.js';

/** 사용자 tag 등록 */
export async function upsertUserTag({ user_id, tag, delta = 1.0 }) {
  // `EXCLUDED.weight`: 새로 삽입하려던 `weight` 값
  const sql = `
    INSERT INTO user_tags (user_id, tag, weight)
    VALUES ($1, $2, GREATEST($3, 0))
    ON CONFLICT (user_id, tag)
    DO UPDATE SET weight = user_tags.weight + EXCLUDED.weight,
                  updated_at = now()
    RETURNING user_id, tag, weight`;
  const params = [user_id, tag.trim(), delta];
  const { rows } = await query(sql, params);

  return rows[0];
}
