// src/controllers/challenge.controller.js
// 요청-응답 처리
import * as challengeService from '../services/challenge.service.js';

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
  const { page = '1', limit = '10', sort } = req.query;
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

  /** 챌린지 목록 가져오기 */
  const challengesList = await challengeService.getChallenges({ user_id, sort, limit: limitNum, offset });

  res.status(200).json({
    ok: true,
    user_id,
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
