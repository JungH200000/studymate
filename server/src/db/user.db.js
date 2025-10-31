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
