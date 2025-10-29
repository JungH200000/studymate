// src/db/post.db.js
// db query 처리
import { query } from './pool.js';

/** 챌린지 확인 */
export async function verifyChallenge({ challenge_id }) {
  const sql = `
    SELECT challenge_id FROM challenges 
    WHERE challenge_id = $1`;
  const params = [challenge_id];

  const { rowCount } = await query(sql, params);

  return rowCount > 0;
}

/** 참가자 여부 확인 */
export async function verifyParticipation({ user_id, challenge_id }) {
  const sql = `
    SELECT user_id, challenge_id
    FROM participation
    WHERE user_id = $1 AND challenge_id = $2`;
  const params = [user_id, challenge_id];

  const { rowCount } = await query(sql, params);

  return rowCount > 0;
}

/** 오늘 해당 챌린지에 이미 인증글을 등록했는지 확인 */
export async function duplicatedDailyPost({ user_id, challenge_id }) {
  // 날짜 계산은 DB에서!!!
  const sql = `
    WITH kst AS (
      SELECT (now() AT TIME ZONE 'Asia/Seoul')::date AS d
    ) -- kst table을 만들고 d column을 만든 후 그 안에 오늘 kst 시간을 저장
    SELECT 1
    FROM posts p, kst
    WHERE p.user_id = $1 AND p.challenge_id = $2
      AND p.created_at >= (kst.d::timestamp AT TIME ZONE 'Asia/Seoul')
      AND p.created_at < ((kst.d + INTERVAL '1 day')::timestamp AT TIME ZONE 'Asia/Seoul')`;
  const params = [user_id, challenge_id];

  const { rows, rowCount } = await query(sql, params);

  // `rowCount = false`이어야 daily 중복 인증글이 없는 것
  return rowCount > 0;
}

/** 인증글 등록 */
export async function createPost({ content, user_id, challenge_id }) {
  const sql = `
    INSERT INTO posts (content, user_id, challenge_id)
    VALUES ($1::jsonb, $2, $3)
    RETURNING post_id, content, user_id, challenge_id, created_at`;
  const params = [content, user_id, challenge_id];

  const { rows } = await query(sql, params);

  return rows[0];
}

/** 챌린지 인증글 수 가져오기 */
export async function countPost({ challenge_id }) {
  const sql = `
    SELECT COUNT(*)::int as post_count
    FROM posts
    WHERE challenge_id = $1`;
  const params = [challenge_id];

  const { rows } = await query(sql, params);

  return rows[0].post_count;
}
