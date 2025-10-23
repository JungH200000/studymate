// src/utils/asyncHandler.js
// 비동기 에러 처리 함수
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// 자동으로 try/catch문이 붙는 효과
// Promise.resolve(x): x가 Promise가 아니라도 Promise로 감싸서 반환
