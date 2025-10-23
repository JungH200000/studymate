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




export default router;
