// src/db/report.db.js
import { query } from './pool.js';

/** 인증글 확인 */
export async function verifyPost({ post_id }) {
  const sql = `
    SELECT post_id FROM posts 
    WHERE post_id = $1`;
  const params = [post_id];

  const { rowCount } = await query(sql, params);

  return rowCount > 0;
}

/** 부적절한 챌린지/인증글 신고 */
export async function createReport({ reporter_id, target_type, target_id, content }) {
  const sql = `
    INSERT INTO reports (reporter_id, target_type, target_id, content)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (reporter_id, target_type, target_id) DO NOTHING
    RETURNING report_id, created_at`;
  const params = [reporter_id, target_type, target_id, content];

  const { rows } = await query(sql, params);

  return rows[0] || null;
}
