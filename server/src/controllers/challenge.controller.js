// src/controller/challenge.controller.js
// 요청-응답 처리
import * as challengeService from '../services/challenge.service.js';

export const createChallenge = async (req, res) => {
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
