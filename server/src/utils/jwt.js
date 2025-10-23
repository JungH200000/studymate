// src/utils/jwt.js
// JWT token 생성 함수
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export const signAccess = ({ user_id, email }) => {
  const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
  const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES_IN;

  const accessToken = jwt.sign({ user_id, email }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });

  return accessToken;
};

export const signRefresh = ({ user_id, jti }) => {
  const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
  const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES_IN;

  const refresh_token = jwt.sign({ user_id, jti }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });

  return refresh_token;
};
