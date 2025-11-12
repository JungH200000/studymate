// src/services/challenge.service.js
// 비지니스 로직
import * as challengeDB from '../db/challenge.db.js';
import { verifyUser } from '../db/user.db.js';

export async function createChallenge({
  title,
  content,
  frequency_type,
  target_per_week,
  start_date,
  end_date,
  creator_id,
}) {
  const createdChallenge = await challengeDB.createChallenge({
    title,
    content,
    frequency_type,
    target_per_week,
    start_date,
    end_date,
    creator_id,
  });

  return createdChallenge;
}

/** 챌린지 목록 가져오기 */
export async function getChallenges({ user_id, q, sort, limit, offset }) {
  /** 챌린지 목록 */
  const challengesList = await challengeDB.getChallenges({ user_id, q, sort, limit, offset });
  // 빈 목록은 200 + []
  if (!challengesList || challengesList.length === 0) {
    return [];
  }

  /** challengesList에서 각 challenge의 id를 가져와 challenges_ids로 만듦 */
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
    challengeDB.getParticipation({ user_id, challenges_ids }),
    challengeDB.getLike({ user_id, challenges_ids }),
    challengeDB.getParticipationUserList({ challenges_ids }),
    challengeDB.getLikeUserList({ challenges_ids }),
    challengeDB.countParticipation({ challenges_ids }),
    challengeDB.countLike({ challenges_ids }),
    challengeDB.countPost({ challenges_ids }),
  ]);

  // 내가 참여한 챌린지 Ids
  const joinedSet = new Set(participateChallenge_ids.map((challenge) => challenge.challenge_id));
  // 내가 좋아요한 챌린지 Ids
  const likedSet = new Set(likeChallenge_ids.map((challenge) => challenge.challenge_id));

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

  /** challenge에 참여 유무/좋아요 유무 true/false로 나타냄 */
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

/** 챌린지 참여 신청 */
export async function postParticipation({ user_id, challenge_id }) {
  return await challengeDB.postParticipation({ user_id, challenge_id });
}

/** 챌린지 참여 취소 */
export async function deleteParticipation({ user_id, challenge_id }) {
  return await challengeDB.deleteParticipation({ user_id, challenge_id });
}

/** 챌린지 좋아요 */
export async function postLike({ user_id, challenge_id }) {
  return await challengeDB.postLike({ user_id, challenge_id });
}

/** 챌린지 좋아요 취소 */
export async function deleteLike({ user_id, challenge_id }) {
  return await challengeDB.deleteLike({ user_id, challenge_id });
}

/** 주간 달성률 */
export async function weeklyAchieved({ user_id }) {
  const isUser = await verifyUser({ user_id });
  if (!isUser) {
    const error = new Error('사용자를 찾을 수 없습니다.');
    error.status = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  /** 주간 챌린지별 달성률 */
  const achievedChallengesList = await challengeDB.weeklyAchieved({ user_id });

  // 이번 주 시작일 ~ 오늘까지 달성률
  const weeklySoFarAchieved = achievedChallengesList.reduce((t, c) => t + c.achieved_sofar_capped, 0);
  const weeklySoFarTarget = achievedChallengesList.reduce((t, c) => t + c.weekly_target_sofar, 0);
  const weeklySoFarRate = weeklySoFarTarget ? +(weeklySoFarAchieved / weeklySoFarTarget).toFixed(3) : 0;

  // 이번 주 전체 총 달성률
  const weeklyFullAchieved = achievedChallengesList.reduce((t, c) => t + c.achieved_full_capped, 0);
  const weeklyFullTarget = achievedChallengesList.reduce((t, c) => t + c.weekly_target_full, 0);
  const weeklyFullRate = weeklyFullTarget ? +(weeklyFullAchieved / weeklyFullTarget).toFixed(3) : 0;

  return {
    achievedChallengesList,
    today: { weeklySoFarAchieved, weeklySoFarTarget, weeklySoFarRate },
    weekly: { weeklyFullAchieved, weeklyFullTarget, weeklyFullRate },
  };
}

/** 전체 달성률 */
export async function totalAchieved({ user_id }) {
  const isUser = await verifyUser({ user_id });
  if (!isUser) {
    const error = new Error('사용자를 찾을 수 없습니다.');
    error.status = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  /** 전체 챌린지별 달성률 */
  const achievedChallengesList = await challengeDB.totalAchieved({ user_id });

  // 전체 달성률
  const totalAchieved = achievedChallengesList.reduce((t, c) => t + c.achieved_capped, 0);
  const totalTarget = achievedChallengesList.reduce((t, c) => t + c.challenge_target_day, 0);
  const totalRate = totalTarget ? +(totalAchieved / totalTarget).toFixed(3) : 0;

  return {
    achievedChallengesList,
    total: { totalAchieved, totalTarget, totalRate },
  };
}

/** 최근 30일 달성률 */
export async function day30Achieved({ user_id }) {
  const isUser = await verifyUser({ user_id });
  if (!isUser) {
    const error = new Error('사용자를 찾을 수 없습니다.');
    error.status = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  /** 최근 30일 달성률 */
  const achievedChallengesList = await challengeDB.day30Achieved({ user_id });

  // 최근 30일 전체 달성률
  const day30Achieved = achievedChallengesList.reduce((t, c) => t + c.achieved_30d_capped, 0);
  const day30Target = achievedChallengesList.reduce((t, c) => t + c.target_30d, 0);
  const day30Rate = day30Target ? +(day30Achieved / day30Target).toFixed(3) : 0;

  return {
    achievedChallengesList,
    day30: { day30Achieved, day30Target, day30Rate },
  };
}

/** 최근 30일 달성률 기준으로 랭킹 얻기 */
export async function getRanking({ user_id, limit, offset }) {
  const isUser = await verifyUser({ user_id });
  if (!isUser) {
    const error = new Error('사용자를 찾을 수 없습니다.');
    error.status = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  return await challengeDB.getRanking({ user_id, limit, offset });
}
