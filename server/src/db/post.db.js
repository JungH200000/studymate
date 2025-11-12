// src/db/post.db.js
// db query 처리
import { query } from './pool.js';
import pool from './pool.js';

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
    SELECT EXISTS (
      SELECT 1
      FROM posts
      WHERE user_id = $1 AND challenge_id = $2
        AND posted_date_kst = (now() AT TIME ZONE 'Asia/Seoul')::date
    ) AS exists`;
  const params = [user_id, challenge_id];

  const { rows } = await query(sql, params);

  // true면 중복
  return rows[0].exists;
}

/** 인증글 등록 */
export async function createPost({ content, user_id, challenge_id }) {
  const client = await pool.connect(); // transaction 사용을 위해
  try {
    await client.query('BEGIN');

    const p = await client.query(
      `INSERT INTO posts (content, user_id, challenge_id)
       VALUES ($1::jsonb, $2, $3)
       RETURNING post_id, content, user_id, challenge_id, created_at`,
      [content, user_id, challenge_id]
    );

    await client.query(`INSERT INTO tag_jobs (post_id, user_id) VALUES ($1, $2)`, [p.rows[0].post_id, user_id]);

    await client.query('COMMIT');

    return p.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
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

/** 유저별/챌린지별 누적 참여 횟수(인증글 수) */
export async function countMyPostsInChallenge({ user_id, challenge_id }) {
  const sql = `
    SELECT COUNT(*)::int AS my_post_count
    FROM posts
    WHERE user_id = $1 AND challenge_id = $2`;
  const params = [user_id, challenge_id];

  const { rows } = await query(sql, params);

  return rows[0]?.my_post_count ?? 0;
}

/** 유저별/챌린지별 이번주 참여 횟수 */
export async function countMyPostsThisWeek({ user_id, challenge_id }) {
  // `date_trunc('week', ...)` : 변환된 시간을 기준으로 날짜를 주 단위로 자름
  const sql = `
    WITH kst AS (
    SELECT (date_trunc('week', now() AT TIME ZONE 'Asia/Seoul'))::date AS week_start
    )
    SELECT COUNT(*)::int AS my_week_post_count
    FROM posts p, kst
    WHERE p.user_id = $1 AND p.challenge_id = $2
      AND p.posted_date_kst >= kst.week_start
      AND p.posted_date_kst < (kst.week_start + INTERVAL '7 day')::date;`;
  const params = [user_id, challenge_id];

  const { rows } = await query(sql, params);

  return rows[0]?.my_week_post_count ?? 0;
}

/** 챌린지 target_per_week 가져오기 */
export async function getWeeklyTarget({ challenge_id }) {
  const sql = `
    SELECT
      CASE
        WHEN frequency_type = 'daily' THEN 7
        ELSE COALESCE(target_per_week, 0)
      END AS weekly_target
    FROM challenges
    WHERE challenge_id = $1`;
  const params = [challenge_id];

  const { rows } = await query(sql, params);

  return rows[0]?.weekly_target ?? 0;
}

/** 인증글 목록 가져오기 */
export async function getPosts({ sort, limit, offset, challenge_id }) {
  let sql;
  if (sort === 'newest') {
    sql = `
      SELECT p.*, u.user_id AS author_id, u.username AS author_username
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.user_id
      WHERE p.challenge_id = $1
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3`;
  } else {
    sql = `
      SELECT p.*, u.user_id AS author_id, u.username AS author_username
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.user_id
      WHERE p.challenge_id = $1
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3`;
  }

  const params = [challenge_id, limit, offset];

  const { rows } = await query(sql, params);

  return rows;
}

/** 사용자가 응원한 post의 post_id 가져오기 */
export async function getPostCheer({ user_id, post_ids }) {
  const sql = `
    SELECT post_id FROM post_cheers
    WHERE user_id = $1 AND post_id = ANY($2::uuid[])`;
  const params = [user_id, post_ids];

  const { rows } = await query(sql, params);

  return rows;
}

/** 인증글 응원 수 가져오기 */
export async function getCheerCount({ post_ids }) {
  const sql = `
    SELECT post_id, COUNT(*)::int as cheer_count
    FROM post_cheers
    WHERE post_id = ANY($1::uuid[])
    GROUP BY post_id;`;
  const params = [post_ids];

  const { rows } = await query(sql, params);

  return rows;
}

/** 인증글별 응원한 유저 목록 가져오기 */
export async function getCheerUserList({ post_ids }) {
  const sql = `
    SELECT pc.post_id, u.user_id AS cheer_user_id, u.username AS cheer_username
    FROM post_cheers pc
    LEFT JOIN users u ON pc.user_id = u.user_id
    WHERE pc.post_id = ANY($1::uuid[])
    ORDER BY u.username`;
  const params = [post_ids];

  const { rows } = await query(sql, params);

  return rows;
}

/** POST 응원 클릭 */
export async function postCheer({ user_id, post_id }) {
  const sql = `
    INSERT INTO post_cheers (user_id, post_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, post_id) DO NOTHING
    RETURNING 1`;
  const params = [user_id, post_id];

  const { rowCount } = await query(sql, params);

  const { rows } = await query(
    `
    SELECT COUNT(*)::int AS cheer_count
    FROM post_cheers
    WHERE post_id = $1`,
    [post_id]
  );

  return { cheer_by_me: true, cheer_count: rows[0].cheer_count, created: rowCount > 0 };
}

/** DELETE 응원 취소 */
export async function deleteCheer({ user_id, post_id }) {
  const sql = `
    DELETE FROM post_cheers
    WHERE user_id = $1 AND post_id = $2
    RETURNING 1`;
  const params = [user_id, post_id];

  const { rowCount } = await query(sql, params);

  const { rows } = await query(
    `
    SELECT COUNT(*)::int AS cheer_count
    FROM post_cheers
    WHERE post_id = $1`,
    [post_id]
  );

  return { cheer_by_me: false, cheer_count: rows[0].cheer_count, created: rowCount > 0 };
}
