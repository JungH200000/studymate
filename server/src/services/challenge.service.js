// src/services/challenge.service.js
// 비지니스 로직
import * as challengeDB from '../db/challenge.db.js';

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
export async function getChallenges({ user_id, sort, limit, offset }) {
  /** 챌린지 목록 */
  const challengesList = await challengeDB.getChallenges({ sort, limit, offset });
  if (!challengesList) {
    const error = new Error('챌린지 목록이 없습니다.');
    error.status = 404;
    throw error;
  }

  /** challengesList에서 각 challenge의 id를 가져와 challenges_ids로 만듦 */
  const challenges_ids = challengesList.map((challenge) => challenge.challenge_id);
  if (challenges_ids.length === 0) {
    const error = new Error('챌린지 목록이 없습니다.');
    error.status = 404;
    throw error;
  }

  /** 사용자가 참여한 challenge의 challenge_id 가져오기 */
  const participateChallenge_ids = await challengeDB.getParticipation({ user_id, challenges_ids });
  const joinedSet = new Set(participateChallenge_ids.map((challenge) => challenge.challenge_id));

  /** 사용자가 좋아요한 challenge의 challenge_id 가져오기 */
  const likeChallenge_ids = await challengeDB.getLike({ user_id, challenges_ids });
  const likedSet = new Set(likeChallenge_ids.map((challenge) => challenge.challenge_id));

  /** 챌린지에 참여한 유저 목록 가져오기 */
  const participantUserLists = await challengeDB.getParticipationUserList({ challenges_ids });

  /** 챌린지 참여 수 가져오기 */
  const countParticipations = await challengeDB.countParticipation({ challenges_ids });
  const countParticipationMap = {};
  countParticipations.forEach((challenge) => {
    countParticipationMap[challenge.challenge_id] = Number(challenge.participant_count);
  });

  /** 챌린지 좋아요 수 가져오기 */
  const countLikes = await challengeDB.countLike({ challenges_ids });
  const countLikeMap = {};
  countLikes.forEach((challenge) => {
    countLikeMap[challenge.challenge_id] = Number(challenge.like_count);
  });

  /** 챌린지 인증글 수 가져오기 */
  const countPosts = await challengeDB.countPost({ challenges_ids });
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
    participant_user: participantUserLists
      .map((r) => {
        if (challenge.challenge_id === r.challenge_id) {
          return { participant_user_id: r.participant_user_id, participant_username: r.participant_username };
        } else {
          return;
        }
      })
      .filter(Boolean),
  }));

  return totalChallengesList;
}

/** 챌린지 참여 신청 */
export async function postParticipation({ user_id, challenge_id }) {
  const participationApplyInfo = await challengeDB.postParticipation({ user_id, challenge_id });

  return participationApplyInfo;
}

/** 챌린지 참여 취소 */
export async function deleteParticipation({ user_id, challenge_id }) {
  await challengeDB.deleteParticipation({ user_id, challenge_id });
}
