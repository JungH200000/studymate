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

/** 인증글 목록 가져오기 */
export const getPosts = async (req, res, next) => {
  const { id: user_id } = req.user;
  const challenge_id = req.params.id;
  const { page = '1', limit = '20', sort } = req.query;
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20; // 가져올 개수
  const offset = (pageNum - 1) * limitNum; // 건너뛸 개수
  if (!Number.isInteger(pageNum) || pageNum < 1) {
    const error = new Error('page는 1 이상의 정수');
    error.status = 400;
    error.code = 'INVALID_QUERY';
    throw error;
  }
  if (!Number.isInteger(limitNum) || limit < 1) {
    const error = new Error('limit은 1 이상의 정수');
    error.status = 400;
    error.code = 'INVALID_QUERY';
    throw error;
  }

  /** 인증글 목록 가져오기 */
  const totalPostsList = await postService.getPosts({ sort, limit: limitNum, offset, user_id, challenge_id });

  return res.status(200).json({
    ok: true,
    user_id,
    pageNum,
    limitNum,
    offset,
    postsList: totalPostsList,
  });
};

/** 인증글 응원 */
export const postCheer = async (req, res) => {
  const post_id = req.params.id;
  const { id: user_id } = req.user;

  /** 응원 */
  const cheer = await postService.postCheer({ user_id, post_id });
  const status = cheer.created ? 201 : 200;

  return res.status(status).json({
    ok: false,
    user_id,
    post_id,
    ...cheer,
  });
};

/** 인증글 응원 취소 */
export const deleteCheer = async (req, res) => {
  const post_id = req.params.id;
  const { id: user_id } = req.user;

  const cheer = await postService.deleteCheer({ user_id, post_id });

  return res.status(200).json({
    ok: true,
    user_id,
    post_id,
    ...cheer,
    message: '응원이 취소되었습니다.',
  });
};
