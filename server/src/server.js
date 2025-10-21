// src/server.js
// 서버 시작점
import express from 'express';
import cors from 'cors';
import { query } from './db/pool.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
// origin : 다른 출처(origin)에서 오는 요청을 서버가 허용할지 결정
// credentials : req에 쿠키, 인증 헤더 등 자격 증명이 포함된 요청을 할 수 있도록 허용

/* ===== DB 연결 확인 ===== */
try {
  const result = await query('SELECT current_database(), current_user');
  console.log('✅ Connected to DB:', result.rows[0]);
} catch (err) {
  console.error('❌ DB connection failed:', err.message);
}

/* ===== 서버 연결 확인 ===== */
app.get('/connect', async (req, res) => {
  const result = await query('SELECT now()');
  res.json({ ok: true, time: result.rows[0].now });
});

/* ===== api 동작 테스트 ===== */

/* ===== 라우터 등록 ===== */
app.use('/api/auth', authRoutes);

/* ===== Error ===== */
app.use((error, req, res, next) => {
  const status = error?.status || 500;
  const message = status === 500 ? '서버에 오류가 발생했습니다.' : error.message || '요청을 처리할 수 없습니다.';
  console.error('Error 발생 !!!\n', error);
  res.status(status).json({ ok: false, message });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
