// src/db/challenge.db.js
// db query 처리
import { query } from './pool.js';

/** Challenge 생성 */
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

/** Challenge 목록 가져오기 */
export async function getChallenges({ q, sort, limit, offset }) {
  let sql;
  if (!q) {
    if (sort === 'newest') {
      sql = `
      SELECT c.*, u.user_id AS author_id, u.username AS author_username
      FROM challenges c
      LEFT JOIN users u ON c.creator_id = u.user_id
      ORDER BY c.created_at DESC
      LIMIT $1 OFFSET $2`;
    } else {
      sql = `
      SELECT c.*, u.user_id AS author_id, u.username AS author_username
      FROM challenges c
      LEFT JOIN users u ON c.creator_id = u.user_id
      ORDER BY c.created_at DESC
      LIMIT $1 OFFSET $2`;
    }
    const params = [limit, offset];

    const { rows } = await query(sql, params);

    return rows;
  } else {
    // q(검색어)가 존재할 때
    const raw = (q ?? '').trim();
    const esc = raw.replace(/[%_]/g, (m) => '\\' + m);
    const searchWord = `%${esc}%`;

    sql = `
      SELECT c.*, u.user_id AS author_id, u.username AS author_username
      FROM challenges c
      LEFT JOIN users u ON c.creator_id = u.user_id
      WHERE c.title ILIKE $1 ESCAPE '\\'
      ORDER BY c.created_at DESC
      LIMIT $2 OFFSET $3;`;
    const params = [searchWord, limit, offset];

    const { rows } = await query(sql, params);

    return rows;
  }
}

/** 사용자가 참여한 challenge의 challenge_id 가져오기 */
export async function getParticipation({ user_id, challenges_ids }) {
  const sql = `
    SELECT challenge_id FROM participation
    WHERE user_id = $1 AND challenge_id = ANY($2::uuid[])`;
  const params = [user_id, challenges_ids];

  const { rows } = await query(sql, params);

  return rows;
}

/** 사용자가 좋아요한 challenge의 challenge_id 가져오기 */
export async function getLike({ user_id, challenges_ids }) {
  const sql = `
    SELECT challenge_id FROM challenge_likes
    WHERE user_id = $1 AND challenge_id = ANY($2::uuid[])`;
  const params = [user_id, challenges_ids];

  const { rows } = await query(sql, params);

  return rows;
}

/** 챌린지 참여 수 가져오기 */
export async function countParticipation({ challenges_ids }) {
  const sql = `
    SELECT challenge_id, COUNT(*)::int AS participant_count
    FROM participation
    WHERE challenge_id = ANY($1::uuid[])
    GROUP BY challenge_id`;
  const params = [challenges_ids];

  const { rows } = await query(sql, params);

  return rows;
}

/** 챌린지 좋아요 수 가져오기 */
export async function countLike({ challenges_ids }) {
  const sql = `
    SELECT challenge_id, COUNT(*)::int as like_count
    FROM challenge_likes
    WHERE challenge_id = ANY($1::uuid[])
    GROUP BY challenge_id`;
  const params = [challenges_ids];

  const { rows } = await query(sql, params);

  return rows;
}

/** 챌린지 인증글 수 가져오기 */
export async function countPost({ challenges_ids }) {
  const sql = `
    SELECT challenge_id, COUNT(*)::int as post_count
    FROM posts
    WHERE challenge_id = ANY($1::uuid[])
    GROUP BY challenge_id`;
  const params = [challenges_ids];

  const { rows } = await query(sql, params);

  return rows;
}

/** 챌린지 참여 유저 목록 가져오기 */
export async function getParticipationUserList({ challenges_ids }) {
  const sql = `
    SELECT p.challenge_id, u.user_id AS participant_user_id, u.username AS participant_username
    FROM participation p
    LEFT JOIN users u ON p.user_id = u.user_id
    WHERE p.challenge_id = ANY($1::uuid[])
    ORDER BY u.username`;
  const params = [challenges_ids];

  const { rows } = await query(sql, params);

  return rows;
}

/** 챌린지에 좋아요한 유저 목록 가져오기 */
export async function getLikeUserList({ challenges_ids }) {
  const sql = `
    SELECT cl.challenge_id, u.user_id AS like_user_id, u.username AS like_username
    FROM challenge_likes cl
    LEFT JOIN users u ON cl.user_id = u.user_id
    WHERE cl.challenge_id = ANY($1::uuid[])
    ORDER BY u.username`;
  const params = [challenges_ids];

  const { rows } = await query(sql, params);

  return rows;
}

/** POST 참여 신청 */
export async function postParticipation({ user_id, challenge_id }) {
  const sql = `
    INSERT INTO participation (user_id, challenge_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, challenge_id) DO NOTHING
    RETURNING 1`;
  const params = [user_id, challenge_id];

  const { rowCount } = await query(sql, params);

  const { rows } = await query(
    `
    SELECT COUNT(*)::int AS participant_count
    FROM participation
    WHERE challenge_id = $1`,
    [challenge_id]
  );

  return { joined_by_me: true, participant_count: rows[0].participant_count, created: rowCount > 0 };
}

/** DELETE 참여 취소 */
export async function deleteParticipation({ user_id, challenge_id }) {
  const sql = `
    DELETE FROM participation
    WHERE user_id = $1 AND challenge_id = $2
    RETURNING 1`;
  const params = [user_id, challenge_id];

  const { rowCount } = await query(sql, params);

  const { rows } = await query(
    `
    SELECT COUNT(*)::int as participant_count
    FROM participation
    WHERE challenge_id = $1`,
    [challenge_id]
  );

  return { joined_by_me: false, participant_count: rows[0].participant_count, deleted: rowCount > 0 };
}

/** POST 좋아요 */
export async function postLike({ user_id, challenge_id }) {
  const sql = `
    INSERT INTO challenge_likes (user_id, challenge_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, challenge_id) DO NOTHING
    RETURNING 1`;
  const params = [user_id, challenge_id];

  const { rowCount } = await query(sql, params);

  const { rows } = await query(
    `
    SELECT COUNT(*)::int AS like_count
    FROM challenge_likes
    WHERE challenge_id = $1`,
    [challenge_id]
  );

  return { liked_by_me: true, like_count: rows[0].like_count, created: rowCount > 0 };
}

/** Delete 좋아요 취소 */
export async function deleteLike({ user_id, challenge_id }) {
  const sql = `
    DELETE FROM challenge_likes
    WHERE user_id = $1 AND challenge_id = $2
    RETURNING 1`;
  const params = [user_id, challenge_id];

  const { rowCount } = await query(sql, params);

  const { rows } = await query(
    `
    SELECT COUNT(*)::int AS like_count
    FROM challenge_likes
    WHERE challenge_id = $1`,
    [challenge_id]
  );

  return { liked_by_me: false, like_count: rows[0].like_count, deleted: rowCount > 0 };
}

/** 주간 달성률 */
export async function weeklyAchieved({ user_id }) {
  const sql = `
    WITH kst_today AS (
      SELECT (now() AT TIME ZONE 'Asia/Seoul')::date AS d
    ),
    wk AS (
      SELECT date_trunc('week', d)::date AS start_d,
            (date_trunc('week', d) + interval '6 day')::date AS end_d
      FROM kst_today
    ),
    -- 이번 주에 사용자가 인증해야 하는 챌린지
    cfg AS(
      SELECT c.challenge_id, c.frequency_type, COALESCE(c.target_per_week, 7) AS tpw,
            GREATEST(wk.start_d, c.start_date, pc.join_at::date) AS act_start,
            LEAST(wk.end_d, COALESCE(c.end_date, wk.end_d)) AS act_end_week
      FROM challenges c
      JOIN participation pc on pc.challenge_id = c.challenge_id AND pc.user_id = $1
      CROSS JOIN wk
      WHERE c.start_date <= wk.end_d 
        AND (c.end_date IS NULL OR c.end_date >= wk.start_d)
        AND pc.join_at::date <= wk.end_d
    ),
    -- 오늘 날짜 추가
    cut AS (
      SELECT challenge_id, frequency_type, tpw, act_start, act_end_week,
            LEAST(act_end_week, (now() AT TIME ZONE 'Asia/Seoul')::date) AS act_end_today
    FROM cfg
    ),
    days AS (
      SELECT challenge_id, frequency_type, tpw, act_start, act_end_week, act_end_today,
            GREATEST(0, (act_end_week - act_start + 1))::int AS days_week,
            GREATEST(0, (act_end_today - act_start + 1))::int AS days_sofar
    FROM cut
    ),
    -- 주간 참여해야 하는 일 수 / 오늘까지 참여해야 하는 일 수
    targets AS (
      SELECT challenge_id, frequency_type, tpw, act_start, act_end_week, act_end_today, days_week, days_sofar,
            CASE WHEN days_week <= 0 THEN 0
                  WHEN frequency_type = 'daily' THEN days_week
                  ELSE CEIL(tpw * days_week / 7.0)::int
            END AS target_week,
            CASE WHEN days_sofar <= 0 THEN 0
                  WHEN frequency_type = 'daily' THEN days_sofar
                  ELSE CEIL(tpw * days_sofar / 7.0)::int
            END AS target_sofar
      FROM days      
    ),
    -- 이번주 챌린지별 인증 횟수
    achieved AS (
      SELECT p.challenge_id, COUNT(DISTINCT p.posted_date_kst)::int AS cnt
      FROM posts p
      JOIN targets t ON t.challenge_id = p.challenge_id
      WHERE p.user_id = $1
        AND p.posted_date_kst BETWEEN t.act_start AND t.act_end_today
      GROUP BY p.challenge_id
    )
    SELECT t.challenge_id, c.title, 
           COALESCE(a.cnt) AS achieved_sofar,
           LEAST(COALESCE(a.cnt, 0), t.target_sofar) AS achieved_sofar_capped,
           t.target_sofar AS weekly_target_sofar,
           CASE WHEN t.target_sofar > 0
                 THEN ROUND(LEAST(COALESCE(a.cnt, 0), t.target_sofar)::numeric / t.target_sofar, 3)
                 ELSE 0
           END AS rate_sofar,
           LEAST(COALESCE(a.cnt, 0), t.target_week) AS achieved_full_capped,
           t.target_week AS weekly_target_full,
           CASE WHEN t.target_week > 0
                 THEN ROUND(LEAST(COALESCE(a.cnt, 0), t.target_week)::numeric / t.target_week, 3)
                 ELSE 0
           END AS rate_fullweek,
           GREATEST(t.target_week - LEAST(COALESCE(a.cnt, 0), t.target_week), 0) AS remaining_to_100,
           GREATEST(t.days_week - t.days_sofar, 0) AS remaining_days
    FROM targets t
    LEFT JOIN achieved a USING (challenge_id)
    LEFT JOIN challenges c ON t.challenge_id = c.challenge_id
    ORDER BY t.challenge_id`;
  const params = [user_id];

  const { rows } = await query(sql, params);

  return rows;
}
