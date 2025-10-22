import express from "express";
import { query } from "../db/pool.js";
import bcrypt from "bcrypt";

const router = express.Router();

// POST /api/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ ok: false, error: "이메일과 비밀번호 필요" });

  try {
    const result = await query("SELECT user_id, email, username, password_hash FROM users WHERE email=$1", [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ ok: false, error: "사용자를 찾을 수 없음" });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ ok: false, error: "비밀번호가 일치하지 않음" });
    }

    // 로그인 성공
    res.json({ ok: true, user: { user_id: user.user_id, email: user.email, username: user.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "서버 오류" });
  }
});


// POST /api/signup
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ ok: false, error: "모든 항목을 입력하세요" });
  }

  try {
    // 이메일 또는 username 중복 확인
    const exist = await query(
      "SELECT user_id FROM users WHERE email=$1 OR username=$2",
      [email, username]
    );
    if (exist.rows.length > 0) {
      return res.status(409).json({ ok: false, error: "이미 존재하는 이메일 또는 닉네임입니다" });
    }

    // 비밀번호 해시 생성
    const bcrypt = await import("bcryptjs");
    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);

    // users 테이블에 INSERT
    const result = await query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, username, email",
      [username, email, password_hash]
    );

    res.json({ ok: true, user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "서버 오류" });
  }
});


export default router;
