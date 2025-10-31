// src/db/user.db.js
import { query } from './pool.js';

/** 존재하는 사용자인지 확인 */
export async function verifyUser({ user_id }) {
  const sql = `
    SELECT user_id
    FROM users
    WHERE user_id = $1`;
  const params = [user_id];

  const { rowCount } = await query(sql, params);

  return rowCount > 0;
}
/** 사용자 정보 가져오기 */
export async function getUserInfo({ user_id }) {
  const sql = `
    SELECT user_id, email, username, created_at
    FROM users
    WHERE user_id = $1`;
  const params = [user_id];

  const { rows } = await query(sql, params);

  return rows[0];
}

/** 참여/생성 챌린지 목록 가져오기 */
export async function getChallenges({ type, limit, offset, sort, user_id }) {
  if (type === 'created') {
    // 사용자가 생성한 챌린지
    const sql = `
      SELECT c.*
      FROM challenges c
      WHERE c.creator_id = $1
      ORDER BY c.created_at DESC
      LIMIT $2 OFFSET $3`;
    const params = [user_id, limit, offset];

    const { rows } = await query(sql, params);

    return rows;
  } else if (type === 'joined') {
    // 사용자가 참여한 챌린지
    const sql = `
      SELECT c.*
      FROM participation p
      LEFT JOIN challenges c ON c.challenge_id = p.challenge_id
      WHERE user_id = $1
      ORDER BY c.created_at DESC
      LIMIT $2 OFFSET $3`;
    const params = [user_id, limit, offset];

    const { rows } = await query(sql, params);

    return rows;
  }
}

/**
 * 타 사용자 팔로우
 * - `follower_id` : 팔로우 하는 사람
 * - `followee_id` : 팔로우 받는 사람
 */
export async function postFollow({ follower_id, followee_id }) {
  const sql = `
    INSERT INTO follows (follower_id, followee_id)
    VALUES ($1, $2)
    ON CONFLICT (follower_id, followee_id) DO NOTHING
    RETURNING 1`;
  const params = [follower_id, followee_id];

  const { rowCount } = await query(sql, params);

  const { rows } = await query(
    `
    SELECT COUNT(*)::int AS follower_count
    FROM follows
    WHERE followee_id = $1`,
    [followee_id]
  );

  return { follow_by_me: true, follower_count: rows[0].follower_count, created: rowCount > 0 };
}
/** 사용자 팔로우 취소 */
export async function deleteFollow({ follower_id, followee_id }) {
  const sql = `
    DELETE FROM follows
    WHERE follower_id = $1 AND followee_id = $2
    RETURNING 1`;
  const params = [follower_id, followee_id];

  const { rowCount } = await query(sql, params);

  const { rows } = await query(
    `
    SELECT COUNT(*)::int AS follower_count
    FROM follows
    WHERE followee_id = $1`,
    [followee_id]
  );

  return { follow_by_me: false, follower_count: rows[0].follower_count, deleted: rowCount > 0 };
}

/** 사용자 팔로워 수 : 나를 팔로우한 사용자 수 */
export async function followerCount({ user_id }) {
  const sql = `
    SELECT COUNT(*)::int AS follower_count
    FROM follows
    WHERE followee_id = $1`;
  const params = [user_id];

  const { rows } = await query(sql, params);

  return rows[0].follower_count;
}

/** 사용자 팔로워 목록 */
export async function followerList({ user_id }) {
  const sql = `
    SELECT u.user_id, u.username, f.created_at AS followed_at
    FROM follows f
    LEFT JOIN users u ON f.follower_id = u.user_id
    WHERE followee_id = $1
    ORDER BY u.username`;
  const params = [user_id];

  const { rows } = await query(sql, params);

  return rows;
}

/** 사용자 팔로잉 수 : 내가 팔로우한 사용자 수 */
export async function followingCount({ user_id }) {
  const sql = `
    SELECT COUNT(*)::int AS following_count
    FROM follows
    WHERE follower_id = $1`;
  const params = [user_id];

  const { rows } = await query(sql, params);

  return rows[0].following_count;
}

/** 사용자 팔로잉 목록 */
export async function followingList({ user_id }) {
  const sql = `
    SELECT u.username AS followerName, f.*
    FROM follows f
    LEFT JOIN users u ON f.followee_id = u.user_id
    WHERE follower_id = $1
    ORDER BY u.username`;
  const params = [user_id];

  const { rows } = await query(sql, params);

  return rows;
}
