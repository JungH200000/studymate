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
export async function getChallenges({ sort, limit, offset }) {
  let sql;
  if (sort === 'newest') {
    sql = `
      SELECT c.*, u.user_id as author_id, u.username as author_username
      FROM challenges c
      LEFT JOIN users u ON c.creator_id = u.user_id
      ORDER BY c.created_at DESC
      LIMIT $1 OFFSET $2`;
  } else {
    sql = `
      SELECT c.*, u.user_id as author_id, u.username as author_username
      FROM challenges c
      LEFT JOIN users u ON c.creator_id = u.user_id
      ORDER BY c.created_at DESC
      LIMIT $1 OFFSET $2`;
  }
  const params = [limit, offset];

  const { rows } = await query(sql, params);

  return rows;
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
    SELECT challenge_id, COUNT(*) AS participant_count
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
    SELECT challenge_id, COUNT(*) as like_count
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
    SELECT challenge_id, COUNT(*) as post_count
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
    WHERE p.challenge_id = ANY($1::uuid[])`;
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
    WHERE cl.challenge_id = ANY($1::uuid[]);`;
  const params = [challenges_ids];

  const { rows } = await query(sql, params);

  return rows;
}

/** POST 참여 신청 */
export async function postParticipation({ user_id, challenge_id }) {
  const sql = `
    INSERT INTO participation (user_id, challenge_id)
    VALUES ($1, $2)
    RETURNING user_id, challenge_id`;
  const params = [user_id, challenge_id];

  const { rows } = await query(sql, params);

  return rows[0];
}

/** DELETE 참여 취소 */
export async function deleteParticipation({ user_id, challenge_id }) {
  const sql = `
    DELETE FROM participation
    WHERE user_id = $1 AND challenge_id = $2`;
  const params = [user_id, challenge_id];

  await query(sql, params);
}

/** POST 좋아요 */
export async function postLike({ user_id, challenge_id }) {
  const sql = `
    INSERT INTO challenge_likes (user_id, challenge_id)
    VALUES ($1, $2)
    RETURNING user_id, challenge_id`;
  const params = [user_id, challenge_id];

  const { rows } = await query(sql, params);

  return rows[0];
}

/** Delete 좋아요 취소 */
export async function deleteLike({ user_id, challenge_id }) {
  const sql = `
    DELETE FROM challenge_likes
    WHERE user_id = $1 AND challenge_id = $2`;
  const params = [user_id, challenge_id];

  await query(sql, params);
}
