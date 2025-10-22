// src/routes/challenges.js
import express from "express";
import { query } from "../db/pool.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// 챌린지 생성
router.post("/challenges", async (req, res) => {
  try {
    const {
      title,
      content,
      frequencyType,
      targetPerWeek,
      startDate,
      endDate,
      creatorId
    } = req.body;

    if (!title || !frequencyType || !startDate || !creatorId) {
      return res.status(400).json({ error: "필수 항목이 없습니다." });
    }

    const challenge_id = uuidv4();
    const target_per_week = frequencyType === "weekly" ? targetPerWeek : null;

    const result = await query(
      `INSERT INTO challenges
      (challenge_id, title, content, frequency_type, target_per_week, start_date, end_date, creator_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *`,
      [challenge_id, title, content, frequencyType, target_per_week, startDate, endDate, creatorId]
    );

    res.json({ ok: true, challenge: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "챌린지 생성 실패" });
  }
});

// 챌린지 목록 조회
router.get("/challenges", async (req, res) => {
  try {
    const result = await query(
      `SELECT 
         c.challenge_id,
         c.title,
         c.content,
         c.frequency_type,
         c.target_per_week,
         to_char(c.start_date, 'YYYY-MM-DD') AS start_date,
         to_char(c.end_date, 'YYYY-MM-DD') AS end_date,
         c.created_at,
         c.creator_id,
         u.username
       FROM challenges c
       JOIN users u ON c.creator_id = u.user_id
       ORDER BY c.created_at DESC`
    );

    res.json({ ok: true, challenges: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "챌린지 목록 조회 실패" });
  }
});

// 상세 조회
router.get("/challenges/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT 
         c.challenge_id,
         c.title,
         c.content,
         c.frequency_type,
         c.target_per_week,
         to_char(c.start_date, 'YYYY-MM-DD') AS start_date,
         to_char(c.end_date, 'YYYY-MM-DD') AS end_date,
         c.created_at,
         c.creator_id,
         u.username
       FROM challenges c
       JOIN users u ON c.creator_id = u.user_id
       WHERE c.challenge_id = $1`,
      [id]
    );

    if (result.rows.length === 0) return res.status(404).json({ ok: false });

    res.json({ ok: true, challenge: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

// 좋아요 추가/취소
router.post("/challenges/:id/like", async (req, res) => {
  const challengeId = req.params.id;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ ok: false, error: "userId required" });
  }

  try {
    // UUID 형식 검사 (Postgres 오류 방지)
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(challengeId)) {
      return res.status(400).json({ ok: false, error: "Invalid challengeId" });
    }

    // 기존 좋아요 체크
    const existing = await query(
      "SELECT 1 FROM challenge_likes WHERE user_id = $1 AND challenge_id = $2",
      [userId, challengeId]
    );

    let liked;
    if (existing.rows.length > 0) {
      // 좋아요 취소
      await query(
        "DELETE FROM challenge_likes WHERE user_id = $1 AND challenge_id = $2",
        [userId, challengeId]
      );
      liked = false;
    } else {
      // 좋아요 추가
      await query(
        "INSERT INTO challenge_likes (user_id, challenge_id) VALUES ($1, $2)",
        [userId, challengeId]
      );
      liked = true;
    }

    // 최신 좋아요 개수 반환
    const countRes = await query(
      "SELECT COUNT(*) AS count FROM challenge_likes WHERE challenge_id = $1",
      [challengeId]
    );

    const count = Number(countRes.rows[0].count);

    res.json({ ok: true, liked, count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "서버 오류" });
  }
});


// 좋아요 개수 + 상태
router.get("/challenges/:id/likes", async (req, res) => {
  const challengeId = req.params.id;
  const userId = req.query.userId;
  try {
    const countRes = await query(
      "SELECT COUNT(*) AS count FROM challenge_likes WHERE challenge_id = $1",
      [challengeId]
    );
    const count = Number(countRes.rows[0].count);

    let liked = false;
    if (userId) {
      const userRes = await query(
        "SELECT 1 FROM challenge_likes WHERE challenge_id = $1 AND user_id = $2",
        [challengeId, userId]
      );
      liked = userRes.rows.length > 0;
    }

    res.json({ ok: true, count, liked });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "서버 오류" });
  }
});

export default router;
