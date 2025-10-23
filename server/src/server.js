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
app.use(cookieParser()); // refresh cookie usage
app.use(
    // CORS 설정 수정: localhost와 127.0.0.1 모두 허용
    cors({
        origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
        credentials: true,
    })
);
// origin : Determines whether the server allows requests from other origins.
// credentials : Allows requests that include credentials such as cookies and authentication headers.
// Actual Device : http://127.0.0.1:5173 / AVD : http://10.0.2.2:5173 / PC : http://localhost:5173

/* ===== DB Connection Check ===== */
try {
    const result = await query('SELECT current_database(), current_user');
    console.log('✅ Connected to DB:', result.rows[0]);
} catch (err) {
    console.error('❌ DB connection failed:', err.message);
}

/* ===== Server Connection Check ===== */
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

/* ===== API Operation Test ===== */

/* ===== Router Registration ===== */
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);

/* ===== Global Error Handler ===== */
app.use((error, req, res, next) => {
    const status = error?.status || 500;
    const message = status === 500 ? '서버에 오류가 발생했습니다.' : error.message || '요청을 처리할 수 없습니다.';
    console.error('Error occurred!!!\n', error);
    res.status(status).json({ ok: false, message });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
