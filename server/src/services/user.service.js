// src/services/user.service.js
import * as userDB from '../db/user.db.js';
import * as challengeDB from '../db/challenge.db.js';

/** 사용자 정보 가져오기 */
export async function getUserInfo({ user_id, viewer_id }) {
  /** 존재하는 사용자인지 확인 */
  const isUser = await userDB.verifyUser({ user_id });
  if (!isUser) {
    const error = new Error('사용자를 찾을 수 없습니다.');
    error.status = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  /** 사용자 정보 가져오기 */
  const user = await userDB.getUserInfo({ user_id });
  if (!viewer_id || viewer_id !== user.user_id) {
    delete user.email;
  }

  return user;
}

/** 참여/생성 챌린지 목록 가져오기 */
export async function getChallenges({ type, limit, offset, sort, user_id, viewer_id }) {
  const isUser = await userDB.verifyUser({ user_id });
  /** 존재하는 사용자인지 확인 */
  if (!isUser) {
    const error = new Error('사용자를 찾을 수 없습니다.');
    error.status = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }
  /** 챌린지 목록 */
  const challengesList = await userDB.getChallenges({ type, limit, offset, sort, user_id });
  // 빈 목록은 200 + []
  if (!challengesList || challengesList.length === 0) {
    return [];
  }

  /** challegesList에서 challenge_id 모음 */
  const challenges_ids = challengesList.map((challenge) => challenge.challenge_id);

  const [
    participateChallenge_ids, // 내가 참여한 챌린지 Ids
    likeChallenge_ids, // 내가 좋아요한 챌린지 Ids
    participantUserLists, // 챌린지별 참여자 목록
    likeUserLists, // 챌린지별 좋아요 유저 목록
    countParticipations, // 챌린지별 참여자 수
    countLikes, // 챌린지별 좋아요 수
    countPosts, // 챌린지별 인증글 수
  ] = await Promise.all([
    challengeDB.getParticipation({ user_id: viewer_id, challenges_ids }),
    challengeDB.getLike({ user_id: viewer_id, challenges_ids }),
    challengeDB.getParticipationUserList({ challenges_ids }),
    challengeDB.getLikeUserList({ challenges_ids }),
    challengeDB.countParticipation({ challenges_ids }),
    challengeDB.countLike({ challenges_ids }),
    challengeDB.countPost({ challenges_ids }),
  ]);

  /** 내가 참여한 챌린지 Ids */
  const joinedSet = new Set(participateChallenge_ids.map((challenge) => challenge.challenge_id));
  /** 내가 좋아요한 챌린지 Ids */
  const likedSet = new Set(likeChallenge_ids.map((challenge) => challenge.challenge_id));
  console.log(joinedSet);
  console.log(likedSet);
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

  /** 챌린지별 참여 유저 목록 */
  const participantByChallenge = groupBy(participantUserLists, 'challenge_id', (r) => ({
    participant_user_id: r.participant_user_id,
    participant_username: r.participant_username,
  }));

  /** 챌린지별 좋아요 유저 목록 */
  const likeByChallenge = groupBy(likeUserLists, 'challenge_id', (r) => ({
    like_user_id: r.like_user_id,
    like_username: r.like_username,
  }));

  /** 챌린지 참여 유저 수 */
  const countParticipationMap = {};
  countParticipations.forEach((challenge) => {
    countParticipationMap[challenge.challenge_id] = Number(challenge.participant_count);
  });

  /** 챌린지별 좋아요 수 */
  const countLikeMap = {};
  countLikes.forEach((challenge) => {
    countLikeMap[challenge.challenge_id] = Number(challenge.like_count);
  });

  /** 챌린지별 인증글 수 가져오기 */
  const countPostMap = {};
  countPosts.forEach((challenge) => {
    countPostMap[challenge.challenge_id] = Number(challenge.post_count);
  });

  const totalChallengesList = challengesList.map((challenge) => ({
    ...challenge,
    joined_by_me: joinedSet.has(challenge.challenge_id),
    participant_count: countParticipationMap[challenge.challenge_id] || 0,
    liked_by_me: likedSet.has(challenge.challenge_id),
    like_count: countLikeMap[challenge.challenge_id] || 0,
    post_count: countPostMap[challenge.challenge_id] || 0,
    participant_user: participantByChallenge[challenge.challenge_id] ?? [],
    like_user: likeByChallenge[challenge.challenge_id] ?? [],
  }));

  return totalChallengesList;
}

/** 타 사용자 팔로우 */
export async function postFollow({ user_id, viewer_id }) {
  const isUser = await userDB.verifyUser({ user_id });
  /** 존재하는 사용자인지 확인 */
  if (!isUser) {
    const error = new Error('사용자를 찾을 수 없습니다.');
    error.status = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  return await userDB.postFollow({ follower_id: viewer_id, followee_id: user_id });
}

/** 타 사용자 언팔로우 */
export async function deleteFollow({ user_id, viewer_id }) {
  const isUser = await userDB.verifyUser({ user_id });
  /** 존재하는 사용자인지 확인 */
  if (!isUser) {
    const error = new Error('사용자를 찾을 수 없습니다.');
    error.status = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  return await userDB.deleteFollow({ follower_id: viewer_id, followee_id: user_id });
}

/** 사용자 팔로워 목록 */
export async function getFollowerList({ user_id }) {
  const isUser = await userDB.verifyUser({ user_id });
  /** 존재하는 사용자인지 확인 */
  if (!isUser) {
    const error = new Error('사용자를 찾을 수 없습니다.');
    error.status = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  const followerList = await userDB.followerList({ user_id });
  // 빈 목록은 200 + []
  if (!followerList || followerList.length === 0) {
    return [];
  }

  const followerCount = await userDB.followerCount({ user_id });

  return { followerList, followerCount };
}

/** 사용자 팔로잉 목록 */
export async function getFollowingList({ user_id }) {
  const isUser = await userDB.verifyUser({ user_id });
  /** 존재하는 사용자인지 확인 */
  if (!isUser) {
    const error = new Error('사용자를 찾을 수 없습니다.');
    error.status = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  const followingList = await userDB.followingList({ user_id });
  // 빈 목록은 200 + []
  if (!followingList || followingList.length === 0) {
    return [];
  }

  const followingCount = await userDB.followingCount({ user_id });

  return { followingList, followingCount };
}
