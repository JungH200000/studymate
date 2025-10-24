// src/utils/jwt.js
// JWT token 생성 함수
import jwt from 'jsonwebtoken';

export const signAccess = ({ sub, email }) => {
  const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
  const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES_IN;

  const accessToken = jwt.sign({ sub, email }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });

  return accessToken;
};

export const signRefresh = ({ sub, jti }) => {
  const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
  const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES_IN;
  const refreshToken = jwt.sign({ sub, jti }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });

  return refreshToken;
};
