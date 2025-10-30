// src/controllers/post.controller.js
import * as postService from '../services/post.service.js';
import { validate } from 'uuid';

/** 인증글 등록 */
export const createPost = async (req, res, next) => {
  const { content } = req.body;
  // content가 비어있지는 않은지 검증
  if (!content || Object.keys(content).length === 0) {
    const error = new Error('content가 비어있습니다.');
    error.status = 400;
    error.code = 'INVALID_POST_INPUT';
    throw error;
  }

  const { id: user_id } = req.user;
  const challenge_id = req.params.id;

  // 제대로된 UUID 형식인지 검증
  if (!validate(challenge_id)) {
    const error = new Error('정확하지 않은 UUID입니다.');
    error.status = 400;
    error.code = 'INVALID_UUID';
    throw error;
  }

  const { post, postCount } = await postService.createPost({ content, user_id, challenge_id });

  return res.status(201).json({
    ok: true,
    message: '인증글이 등록되었습니다.',
    post,
    post_count: postCount,
  });
};
