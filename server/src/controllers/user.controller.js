// src/controllers/user.controller.js
import * as userService from '../services/user.service.js';
import { validate } from 'uuid';

/** 사용자 본인 정보 가져오기 */
export const getMyInfo = async (req, res) => {
  const { id: user_id } = req.user;
  if (!validate(user_id)) {
    const error = new Error('정확하지 않은 UUID입니다.');
    error.status = 400;
    error.code = 'INVALID_UUID';
    throw error;
  }
  const viewer_id = user_id;

  const user = await userService.getUserInfo({ user_id, viewer_id });

  return res.status(200).json({
    ok: true,
    user,
  });
};
/** 타 사용자 정보 가져오기 */
export const getUserInfo = async (req, res) => {
  const user_id = req.params.id;
  if (!validate(user_id)) {
    const error = new Error('정확하지 않은 UUID입니다.');
    error.status = 400;
    error.code = 'INVALID_UUID';
    throw error;
  }

  const viewer_id = req.user?.id;

  const user = await userService.getUserInfo({ user_id, viewer_id });

  return res.status(200).json({
    ok: true,
    user,
  });
};

/** 사용자가 참여/생성한 챌린지 목록 가져오기 */
export const getChallengesByMe = async (req, res) => {
  const { id: user_id } = req.user;
  if (!validate(user_id)) {
    const error = new Error('정확하지 않은 UUID입니다.');
    error.status = 400;
    error.code = 'INVALID_UUID';
    throw error;
  }

  const { type, page = 1, limit = '20', sort } = req.query;
  if (type !== 'created' && type !== 'joined') {
    const error = new Error('type은 created와 joined 둘 중 하나여야 합니다.');
    error.status = 400;
    error.code = 'INVALID_QUERY';
    throw error;
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20; // 가져올 개수
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

  const challengesList = await userService.getChallenges({
    type,
    limit: limitNum,
    offset,
    sort,
    user_id,
    viewer_id: user_id,
  });

  return res.status(200).json({
    ok: true,
    user_id,
    viewer_id: user_id,
    type,
    pageNum,
    limitNum,
    offset,
    challengesList,
  });
};

/** 타 사용자가 참여/생성한 챌린지 목록 가져오기 */
export const getChallengesByUser = async (req, res) => {
  /** viewer_id는 본인 */
  const { id: viewer_id } = req.user;
  if (!validate(viewer_id)) {
    const error = new Error('정확하지 않은 UUID입니다.');
    error.status = 400;
    error.code = 'INVALID_UUID';
    throw error;
  }
  /** 내가 방문한 사용자 페이지의 사용자 */
  const user_id = req.params.id;
  if (!validate(user_id)) {
    const error = new Error('정확하지 않은 UUID입니다.');
    error.status = 400;
    error.code = 'INVALID_UUID';
    throw error;
  }

  const { type, page = 1, limit = '20', sort } = req.query;
  if (type !== 'created' && type !== 'joined') {
    const error = new Error('type은 created와 joined 둘 중 하나여야 합니다.');
    error.status = 400;
    error.code = 'INVALID_QUERY';
    throw error;
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20; // 가져올 개수
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

  const challengesList = await userService.getChallenges({ type, limit: limitNum, offset, sort, user_id, viewer_id });

  return res.status(200).json({
    ok: true,
    viewer_id,
    user_id,
    type,
    pageNum,
    limitNum,
    offset,
    challengesList,
  });
};

/** 타 사용자 팔로우 */
export const postFollow = async (req, res) => {
  const { id: viewer_id } = req.user;
  if (!validate(viewer_id)) {
    const error = new Error('정확하지 않은 UUID입니다.');
    error.status = 400;
    error.code = 'INVALID_UUID';
    throw error;
  }

  const user_id = req.params.id;
  if (!validate(user_id)) {
    const error = new Error('정확하지 않은 UUID입니다.');
    error.status = 400;
    error.code = 'INVALID_UUID';
    throw error;
  }

  const followResult = await userService.postFollow({ user_id, viewer_id });

  return res.status(201).json({
    ok: true,
    followResult,
  });
};

/** 타 사용자 언팔로우 */
export const deleteFollow = async (req, res) => {
  const { id: viewer_id } = req.user;
  if (!validate(viewer_id)) {
    const error = new Error('정확하지 않은 UUID입니다.');
    error.status = 400;
    error.code = 'INVALID_UUID';
    throw error;
  }

  const user_id = req.params.id;
  if (!validate(user_id)) {
    const error = new Error('정확하지 않은 UUID입니다.');
    error.status = 400;
    error.code = 'INVALID_UUID';
    throw error;
  }

  const followResult = await userService.deleteFollow({ user_id, viewer_id });

  return res.status(200).json({
    ok: true,
    followResult,
  });
};

/** 사용자 팔로워 목록 */
export const getFollowerList = async (req, res) => {
  const user_id = req.params.id;
  if (!validate(user_id)) {
    const error = new Error('정확하지 않은 UUID입니다.');
    error.status = 400;
    error.code = 'INVALID_UUID';
    throw error;
  }

  /** 사용자 팔로워 목록 가져오기 */
  const { followerList, followerCount } = await userService.getFollowerList({ user_id });

  return res.status(200).json({
    ok: true,
    followerList,
    followerCount,
  });
};

/** 사용자 팔로잉 목록 */
export const getFollowingList = async (req, res) => {
  const user_id = req.params.id;
  if (!validate(user_id)) {
    const error = new Error('정확하지 않은 UUID입니다.');
    error.status = 400;
    error.code = 'INVALID_UUID';
    throw error;
  }

  /** 사용자 팔로워 목록 가져오기 */
  const { followingList, followingCount } = await userService.getFollowingList({ user_id });

  return res.status(200).json({
    ok: true,
    followingList,
    followingCount,
  });
};
