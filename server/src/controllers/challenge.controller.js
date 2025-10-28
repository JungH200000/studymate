// src/controller/challenge.controller.js
// 요청-응답 처리
import * as challengeService from '../services/challenge.service.js';

export const createChallenge = async (req, res, next) => {
  try {
    const { title, content, frequency_type, target_per_week, start_date, end_date } = req.body;
    const { id: user_id } = req.user;
    const numTpw = frequency_type === 'weekly' ? Number(target_per_week) : null;

    const createdChallenge = await challengeService.createChallenge({
      title,
      content,
      frequency_type,
      target_per_week,
      start_date,
      end_date,
      creator_id: user_id,
    });

    return res.status(201).json({
      ok: true,
      message: 'challenge가 생성되었습니다.',
      challenge: createdChallenge,
    });
  } catch (error) {
    throw next(error);
  }
};

export const getChallenges = async (req, res, next) => {
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

  res.status(200).json({ user_id, pageNum, limitNum, offset, challengesList });
};
