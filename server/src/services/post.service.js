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

/** 인증글 목록 가져오기 */
export async function getPosts({ sort, limit, offset, user_id, challenge_id }) {
  /** 인증글 목록 가져오기 */
  const postsList = await postDB.getPosts({ sort, limit, offset, challenge_id });
  if (!postsList || postsList.length === 0) {
    return [];
  }

  /** 인증글 목록에서 각 인증글의 post_id를 가져와 post_ids 만들기 */
  const post_ids = postsList.map((p) => p.post_id);

  /** 사용자가 응원한 인증글의 post_ids */
  const cheeredUser_ids = await postDB.getPostCheer({ user_id, post_ids });
  /** Set(n) { post_ids } */
  const cheeredSet = new Set(cheeredUser_ids.map((p) => p.post_id));

  /** 인증글별 응원 수 */
  const cheerCount = await postDB.getCheerCount({ post_ids });
  /** post_id : cheer_count */
  const cheerCountMap = {};
  cheerCount.forEach((p) => {
    cheerCountMap[p.post_id] = Number(p.cheer_count);
  });

  /**
   * - rows: [{ challenge_id: 'A', x:1 }, { challenge_id: 'B', x:2 }, { challenge_id: 'A', x:3 }, ...]
   * - key: challenge_id
   * - pick: 행 r에서 최종적으로 담아둘 형태를 만들어주는 함수(원본 그대로면 r 반환
   */
  function groupBy(rows, key, pick) {
    const dict = {}; // 결과를 담을 객체 (id -> 배열)
    for (const r of rows) {
      const k = r[key];
      if (dict[k] === undefined) {
        dict[k] = []; // 처음 보는 id면 빈 배열 준비
      }
      dict[k].push(pick(r)); // 원하는 형태로 담기
    }
    return dict; // 예: { A: [{...}, {...}], B: [{...}] }
  }

  /** 인증글별 응원 유저 목록 */
  const cheerUserList = await postDB.getCheerUserList({ post_ids });
  const cheerListByPost = groupBy(cheerUserList, 'post_id', (r) => ({
    cheer_user_id: r.cheer_user_id,
    cheer_username: r.cheer_username,
  }));

  /** 인증글별 정보/사용자 응원 유무/응원 수/응원한 유저 목록 */
  const totalPostsList = postsList.map((post) => ({
    ...post,
    cheer_by_me: cheeredSet.has(post.post_id),
    cheer_count: cheerCountMap[post.post_id] || 0,
    cheer_user: cheerListByPost[post.post_id] ?? [],
  }));

  return totalPostsList;
}

/** 인증글 응원 */
export async function postCheer({ user_id, post_id }) {
  return await postDB.postCheer({ user_id, post_id });
}

/** 인증글 응원 취소 */
export async function deleteCheer({ user_id, post_id }) {
  return await postDB.deleteCheer({ user_id, post_id });
}
