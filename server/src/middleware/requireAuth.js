// src/middleware/requireAuth.js
// 검증된 사용자인지 인증하는 미들웨어
import jwt from 'jsonwebtoken';

export const requireAuth = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).json({
      ok: false,
      message: 'Authorization 헤더가 없습니다.',
    });
  }

  const [type, token] = auth.split(' ');
  if (!token) {
    return res.status(401).json({
      ok: false,
      message: 'Access Token이 없습니다.',
    });
  }

  try {
    // Access Token 검증
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    if (!decoded?.sub || !decoded?.email) {
      return res.status(401).json({
        ok: false,
        code: 'INVALID_TOKEN',
        message: '유효하지 않은 토큰입니다.',
      });
    }

    // payload(토큰에 담긴 실제 데이터 부분)-> 여기서는 decoded를 말함: { sub(user_id), email }
    req.user = { id: decoded.sub, email: decoded.email };

    return next();
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
    return res.status(401).json({
      ok: false,
      code: 'AUTH_ERROR',
      message: '인증에 실패했습니다.',
    });
  }
};
