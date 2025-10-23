// src/server.js
// 서버 시작점
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { query } from './db/pool.js';
import authRoutes from './routes/auth.routes.js';
import testRoutes from './routes/test.routes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser()); // refresh 쿠키용
app.use(cors({ origin: 'http://127.0.0.1:5173', credentials: true }));
// origin : 다른 출처(origin)에서 오는 요청을 서버가 허용할지 결정
// credentials : req에 쿠키, 인증 헤더 등 자격 증명이 포함된 요청을 할 수 있도록 허용
// 실제 기기 : http://127.0.0.1:5173 / AVD : http://10.0.2.2:5173 / PC : http://localhost:5173

/* ===== DB 연결 확인 ===== */
try {
  const result = await query('SELECT current_database(), current_user');
  console.log('✅ Connected to DB:', result.rows[0]);
} catch (err) {
  console.error('❌ DB connection failed:', err.message);
}

/* ===== 서버 연결 확인 ===== */
app.get('/api/connect', async (req, res, next) => {
  try {
    const { rows } = await query('SELECT now()');
    console.log('✅ Connected to DB:', rows[0].now);
    res.status(200).json({ ok: true, time: rows[0].now });
  } catch (error) {
    console.error('❌ DB connection failed: ', error);
    error.status = 500;
    error.message = 'DB 연결에 실패했습니다.';
    return next(error);
  }
});

/* ===== api 동작 테스트 ===== */

/* ===== 라우터 등록 ===== */
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);

/* ===== 전역 Error ===== */
app.use((error, req, res, next) => {
  const status = error?.status || 500;
  const message = status === 500 ? '서버에 오류가 발생했습니다.' : error.message || '요청을 처리할 수 없습니다.';
  console.error('Error 발생 !!!\n', error);
  res.status(status).json({ ok: false, message });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
