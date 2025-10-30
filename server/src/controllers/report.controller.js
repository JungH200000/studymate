// src/controllers/report.controller.js
import * as reportService from '../services/report.service.js';
import { validate } from 'uuid';

/** 부적절한 챌린지글 신고 */
export const createChallengeReport = async (req, res) => {
  const { content } = req.body;
  // content가 비어있지는 않은지 검증
  const isValidContent = typeof content === 'string' && content.trim().length >= 5 && content.trim().length <= 500;
  if (!isValidContent) {
    const error = new Error('신고 사유는 5~500자여야 합니다.');
    error.status = 400;
    error.code = 'INVALID_REPORT_INPUT';
    throw error;
  }
  const description = content.trim();

  const { id: user_id } = req.user;
  const challenge_id = req.params.id;
  // 제대로된 UUID 형식인지 검증
  if (!validate(challenge_id)) {
    const error = new Error('정확하지 않은 UUID입니다.');
    error.status = 400;
    error.code = 'INVALID_UUID';
    throw error;
  }
  const target_type = 'challenge';

  const report = await reportService.createChallengeReport({
    user_id,
    target_type,
    challenge_id,
    content: description,
  });

  return res.status(201).json({
    ok: true,
    message: '신고되었습니다.',
    report,
  });
};

/** 부적절한 인증글 신고 */
export const createPostReport = async (req, res) => {
  const { content } = req.body;
  // content가 비어있지는 않은지 검증
  const isValidContent = typeof content === 'string' && content.trim().length >= 5 && content.trim().length <= 500;
  if (!isValidContent) {
    const error = new Error('신고 사유는 5~500자여야 합니다.');
    error.status = 400;
    error.code = 'INVALID_REPORT_INPUT';
    throw error;
  }
  const description = content.trim();

  const { id: user_id } = req.user;
  const post_id = req.params.id;
  // 제대로된 UUID 형식인지 검증
  if (!validate(post_id)) {
    const error = new Error('정확하지 않은 UUID입니다.');
    error.status = 400;
    error.code = 'INVALID_UUID';
    throw error;
  }
  const target_type = 'post';

  const report = await reportService.createPostReport({ user_id, target_type, post_id, content: description });

  return res.status(201).json({
    ok: true,
    message: '신고되었습니다.',
    report,
  });
};
