// src/server.js
// 서버 시작점
import express from 'express';
import { query } from './db/pool.js';

const app = express();

app.use(express.json());

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

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
