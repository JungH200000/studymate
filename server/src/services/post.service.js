// src/services/post.service.js
import * as postDB from '../db/post.db.js';

/** 인증글 등록 */
export async function createPost({ content, user_id, challenge_id }) {
  /** 존재하는 챌린지인지 확인 */
  const challenge = await postDB.verifyChallenge({ challenge_id });
  if (!challenge) {
    const error = new Error('챌린지를 찾을 수 없습니다.');
    error.status = 404;
    error.code = 'CHALLENGE_NOT_FOUND';
    throw error;
  }

  /** 챌린지 참가 여부 확인 */
  const isParticipant = await postDB.verifyParticipation({ user_id, challenge_id });
  if (!isParticipant) {
    const error = new Error('해당 챌린지에 참여하지 않았습니다.');
    error.status = 403;
    error.code = 'NOT_PARTICIPANT';
    throw error;
  }

  /** 오늘 해당 챌린지에 이미 인증글을 등록했는지 확인 */
  const isDuplicated = await postDB.duplicatedDailyPost({ user_id, challenge_id });
  if (!isDuplicated) {
    /** 인증글 등록 */
    const post = await postDB.createPost({ content, user_id, challenge_id });
    const postCount = await postDB.countPost({ challenge_id });
    return { post, postCount };
  } else {
    const error = new Error('해당 챌린지에 이미 인증글을 작성하셨습니다.');
    error.status = 409;
    error.code = 'ERR_ALREADY_POSTED_TODAY';
    throw error;
  }
}
