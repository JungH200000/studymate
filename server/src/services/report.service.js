// src/services/report.service.js
import * as reportDB from '../db/report.db.js';
import * as postDB from '../db/post.db.js';

/** 부적절한 챌린지글 신고 */
export async function createChallengeReport({ user_id, target_type, challenge_id, content }) {
  /** 챌린지 존재 확인 */
  const challenge = await postDB.verifyChallenge({ challenge_id });
  if (!challenge) {
    const error = new Error('챌린지를 찾을 수 없습니다.');
    error.status = 404;
    error.code = 'CHALLENGE_NOT_FOUND';
    throw error;
  }

  const isDuplicated = await reportDB.duplicatedReport({ reporter_id: user_id, target_id: challenge_id });
  if (!isDuplicated) {
    /** 부적절한 챌린지글 신고 */
    return await reportDB.createReport({
      reporter_id: user_id,
      target_type,
      target_id: challenge_id,
      content,
    });
  } else {
    const error = new Error('이미 신고한 챌린지입니다.');
    error.status = 409;
    error.code = 'ERR_ALREADY_REPORTED';
    throw error;
  }
}

/** 부적절한 챌린지글 신고 */
export async function createPostReport({ user_id, target_type, post_id, content }) {
  const post = await reportDB.verifyPost({ post_id });
  if (!post) {
    const error = new Error('인증글을 찾을 수 없습니다.');
    error.status = 404;
    error.code = 'POST_NOT_FOUND';
    throw error;
  }

  const isDuplicated = await reportDB.duplicatedReport({ reporter_id: user_id, target_id: post_id });
  if (!isDuplicated) {
    /** 부적절한 인증글 신고 */
    return await reportDB.createReport({
      reporter_id: user_id,
      target_type,
      target_id: post_id,
      content,
    });
  } else {
    const error = new Error('이미 신고한 인증글입니다.');
    error.status = 409;
    error.code = 'ERR_ALREADY_REPORTED';
    throw error;
  }
}
