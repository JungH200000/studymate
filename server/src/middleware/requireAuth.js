// src/middleware/auth.middleware.js
// 검증된 사용자인지 인증하는 미들웨어
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const requireAuth = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    const error = new Error('Authorization 헤더가 없습니다.');
    error.status = 401;
    throw error;
  }

  // Bearer로 시작 -> startsWith가 true 반환
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) {
    const error = new Error('Access Token이 없습니다.');
    error.status = 401;
    throw error;
  }

  try {
    // Access Token 검증
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    // payload(토큰에 담긴 실제 데이터 부분)-> 여기서는 decoded를 말함: { sub(user_id), email }
    req.user = { id: decoded.sub, email: decoded.email };

    next();
  } catch (error) {
    // console.log('requireAuth Error!', error.name, error.code, error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        ok: false,
        code: 'INVALID_TOKEN',
        message: '유효하지 않은 토큰입니다.',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        ok: false,
        code: 'JWT_EXPIRED',
        message: 'Access Token이 만료되었습니다.',
      });
    }
  }
};
