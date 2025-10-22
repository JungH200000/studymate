// src/server.js
import express from 'express';
import { query } from './db/pool.js';
import cors from "cors";
import authRouter from "./routes/auth.js";
import challengeRouter from "./routes/challenges.js";

const app = express();

app.use(cors());
app.use(express.json());

// 로그인 라우터
app.use("/api", authRouter);
// 챌린지 라우터
app.use("/api", challengeRouter);

// 서버 연결 확인
app.get('/connect', async (req, res) => {
  try {
    const result = await query('SELECT now()');
    res.json({ ok: true, time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB 연결 실패" });
  }
});

// 서버 시작과 DB 연결 확인을 async 함수로 감싸기
async function startServer() {
  try {
    const result = await query('SELECT current_database(), current_user');
    console.log('✅ Connected to DB:', result.rows[0]);
    
    app.listen(3000, () => {
      console.log('Server started on port 3000');
    });
  } catch (err) {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1); // DB 연결 실패 시 서버 종료
  }
}

startServer();
