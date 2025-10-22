// src/db/pool.js
// PostgreSQL(DB) 연결 설정
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  //ssl: {rejectUnauthorized: false },
});

export const query = (text, params) => pool.query(text, params);
// query() 함수 생성
// text: SQL 문 (`SELECT * FROM users WHERE id=$1`)
// params: SQL에 들어갈 값 배열 (`[user_id]`)
export default pool;
console.log("📦 DATABASE_URL:", process.env.DATABASE_URL);

