// src/controllers/challenge.controller.js
// 요청-응답 처리
import * as challengeService from '../services/challenge.service.js';
import { validate } from 'uuid';
import { rankCache } from '../utils/rankCache.js';

/** 챌린지 등록 */
export const createChallenge = async (req, res) => {
  const { title, content, frequency_type, target_per_week, start_date, end_date } = req.body;
  const { id: user_id } = req.user;
  const numTpw = frequency_type === 'weekly' ? Number(target_per_week) : null;

  const createdChallenge = await challengeService.createChallenge({
    title,
    content,
    frequency_type,
    target_per_week: numTpw,
    start_date,
    end_date,
    creator_id: user_id,
  });

  return res.status(201).json({
    ok: true,
    message: 'challenge가 생성되었습니다.',
    challenge: createdChallenge,
  });
};

/** 챌린지 목록 가져오기 */
export const getChallenges = async (req, res) => {
  const { id: user_id } = req.user;
  const { q, page = '1', limit = '10', sort } = req.query;
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10; // 가져올 개수
  const offset = (pageNum - 1) * limitNum; // 건너뛸 개수
  if (!Number.isInteger(pageNum) || pageNum < 1) {
    const error = new Error('page는 1 이상의 정수');
    error.status = 400;
    error.code = 'INVALID_QUERY';
    throw error;
  }
  if (!Number.isInteger(limitNum) || limitNum < 1) {
    const error = new Error('limit은 1 이상의 정수');
    error.status = 400;
    error.code = 'INVALID_QUERY';
    throw error;
  }

  const qSafe = typeof q === 'string' ? q.trim() : '';
  const allowedSort = new Set(['newest', 'recommendation']);
  const sortSafe = allowedSort.has(sort) ? sort : 'newest';

  /** 챌린지 목록 가져오기 */
  const challengesList = await challengeService.getChallenges({
    user_id,
    q: qSafe,
    sort: sortSafe,
    limit: limitNum,
    offset,
  });

  res.status(200).json({
    ok: true,
    user_id,
    q,
    pageNum,
    limitNum,
    offset,
    challengesList,
  });
};

/** 챌린지 참여 신청 */
export const postParticipation = async (req, res) => {
  const challenge_id = req.params.id;
  const { id: user_id } = req.user;

  const participation = await challengeService.postParticipation({ user_id, challenge_id });
  const status = participation.created ? 201 : 200;
  return res.status(status).json({
    ok: true,
    user_id,
    challenge_id,
    ...participation,
  });
};

/** 챌린지 참여 취소 */
export const deleteParticipation = async (req, res) => {
  const challenge_id = req.params.id;
  const { id: user_id } = req.user;

  const participation = await challengeService.deleteParticipation({ user_id, challenge_id });

  return res.status(200).json({
    ok: true,
    user_id,
    challenge_id,
    ...participation,
    message: '챌린지 참여 취소되었습니다.',
  });
};

/** 챌린지 좋아요 */
export const postLike = async (req, res) => {
  const challenge_id = req.params.id;
  const { id: user_id } = req.user;

  /** 좋아요한 챌린지와 사용자 ID */
  const like = await challengeService.postLike({ user_id, challenge_id });
  const status = like.created ? 201 : 200;
  return res.status(status).json({
    ok: true,
    user_id,
    challenge_id,
    ...like,
  });
};

/** 챌린지 좋아요 취소 */
export const deleteLike = async (req, res) => {
  const challenge_id = req.params.id;
  const { id: user_id } = req.user;

  const like = await challengeService.deleteLike({ user_id, challenge_id });

  return res.status(200).json({
    ok: true,
    user_id,
    challenge_id,
    ...like,
    message: '좋아요가 취소되었습니다.',
  });
};

/** 주간 달성률 */
export const weeklyAchieved = async (req, res) => {
  const user_id = req.params.id;
  if (!validate(user_id)) {
    const error = new Error('정확하지 않은 UUID입니다.');
    error.status = 400;
    error.code = 'INVALID_UUID';
    throw error;
  }

  const { achievedChallengesList, today, weekly } = await challengeService.weeklyAchieved({ user_id });

  return res.status(200).json({
    ok: true,
    today,
    weekly,
    achievedChallengesList,
  });
};

/** 전체 달성률 */
export const totalAchieved = async (req, res) => {
  const user_id = req.params.id;
  if (!validate(user_id)) {
    const error = new Error('정확하지 않은 UUID입니다.');
    error.status = 400;
    error.code = 'INVALID_UUID';
    throw error;
  }

  const { achievedChallengesList, total } = await challengeService.totalAchieved({ user_id });

  return res.status(200).json({
    ok: true,
    total,
    achievedChallengesList,
  });
};

/** 최근 30일 달성률 */
export const day30Achieved = async (req, res) => {
  const user_id = req.params.id;
  if (!validate(user_id)) {
    const error = new Error('정확하지 않은 UUID입니다.');
    error.status = 400;
    error.code = 'INVALID_UUID';
    throw error;
  }

  const { achievedChallengesList, day30 } = await challengeService.day30Achieved({ user_id });

  return res.status(200).json({
    ok: true,
    day30,
    achievedChallengesList,
  });
};

/** 최근 30일 달성률 기준으로 랭킹 얻기 */
export const getRanking = async (req, res) => {
  // query
  const { page = 1, limit = 50 } = req.query;
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10; // 가져올 개수
  const offset = (pageNum - 1) * limitNum; // 건너뛸 개수
  if (!Number.isInteger(pageNum) || pageNum < 1) {
    const error = new Error('page는 1 이상의 정수');
    error.status = 400;
    error.code = 'INVALID_QUERY';
    throw error;
  }
  if (!Number.isInteger(limitNum) || limitNum < 1) {
    const error = new Error('limit은 1 이상의 정수');
    error.status = 400;
    error.code = 'INVALID_QUERY';
    throw error;
  }

  // user_id
  const { id: user_id } = req.user;
  if (!validate(user_id)) {
    const error = new Error('정확하지 않은 UUID입니다.');
    error.status = 400;
    error.code = 'INVALID_UUID';
    throw error;
  }

  /** 현재 랭킹 */
  const rankingList = await challengeService.getRanking({ user_id, limit: limitNum, offset });

  const key = `rank:${user_id}`;

  /** user_id에 따라 이전 랭킹 조회 */
  const prev = rankCache.get(key); // { at, map }
  const prevMap = prev?.map || new Map();

  /** 순위 변동 계산 (부호 없으면 상승, -면 하락) */
  const entries = rankingList.map((rank) => {
    const prevPos = prevMap.get(rank.user_id);
    const delta = typeof prevPos === 'number' ? prevPos - rank.ranking : 0; // 새로 보이는 유저는 0
    return { ...rank, delta };
  });

  const nextMap = new Map(entries.map((e) => [e.user_id, e.ranking]));
  rankCache.set(key, { at: Date.now(), map: nextMap });

  return res.status(200).json({
    ok: true,
    page,
    limit,
    count: entries.length,
    entries,
  });
};
