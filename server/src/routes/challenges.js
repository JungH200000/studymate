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

// 챌린지 삭제
router.delete("/challenges/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.query.userId; // 쿼리에서 userId 확인

  if (!userId) return res.status(400).json({ ok: false, message: "userId 필요" });

  try {
    const result = await query(
      "DELETE FROM challenges WHERE challenge_id = $1 AND creator_id = $2 RETURNING *",
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ ok: false, message: "삭제 권한 없거나 챌린지 없음" });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ ok: false, message: "서버 오류" });
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

//참가하기, 취소하기
router.post("/challenges/:id/participants", async (req, res) => {
  const challengeId = req.params.id;
  const { userId } = req.body;

  if (!userId)
    return res.status(400).json({ ok: false, error: "userId required" });

  try {
    const existing = await query(
      "SELECT 1 FROM participation WHERE user_id = $1 AND challenge_id = $2",
      [userId, challengeId]
    );

    let joined;
    if (existing.rows.length > 0) {
      await query(
        "DELETE FROM participation WHERE user_id = $1 AND challenge_id = $2",
        [userId, challengeId]
      );
      joined = false;
    } else {
      await query(
        "INSERT INTO participation (user_id, challenge_id) VALUES ($1, $2)",
        [userId, challengeId]
      );
      joined = true;
    }

    const countRes = await query(
      "SELECT COUNT(*) AS count FROM participation WHERE challenge_id = $1",
      [challengeId]
    );
    const count = Number(countRes.rows[0].count);

    res.json({ ok: true, joined, count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "서버 오류" });
  }
});

/* ✅ 7. 참가자 수 + 내 참가 상태 */
router.get("/challenges/:id/participants", async (req, res) => {
  const challengeId = req.params.id;
  const userId = req.query.userId;

  try {
    const countRes = await query(
      "SELECT COUNT(*) AS count FROM participation WHERE challenge_id = $1",
      [challengeId]
    );
    const count = Number(countRes.rows[0].count);

    let joined = false;
    if (userId) {
      const userRes = await query(
        "SELECT 1 FROM participation WHERE challenge_id = $1 AND user_id = $2",
        [challengeId, userId]
      );
      joined = userRes.rows.length > 0;
    }

    res.json({ ok: true, count, joined });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "서버 오류" });
  }
});


// 응원 toggle (챌린지 단위)
router.post("/challenges/:id/cheers", async (req, res) => {
  const { userId } = req.body;
  const { id: challengeId } = req.params;

  if (!userId) return res.status(400).json({ ok: false, error: "userId required" });

  try {
    // 1. 해당 챌린지에 연결된 post 확인 (없으면 생성)
    let postRes = await query(
      "SELECT post_id FROM posts WHERE challenge_id=$1 AND user_id=$2 LIMIT 1",
      [challengeId, userId]
    );

    let postId;
    if (postRes.rows.length === 0) {
      // post가 없으면 생성
      const insertRes = await query(
        "INSERT INTO posts (content, user_id, challenge_id) VALUES ($1, $2, $3) RETURNING post_id",
        ["{}", userId, challengeId]
      );
      postId = insertRes.rows[0].post_id;
    } else {
      postId = postRes.rows[0].post_id;
    }

    // 2. 응원 toggle
    const existing = await query(
      "SELECT 1 FROM post_cheers WHERE user_id=$1 AND post_id=$2",
      [userId, postId]
    );

    let cheered;
    if (existing.rows.length > 0) {
      await query("DELETE FROM post_cheers WHERE user_id=$1 AND post_id=$2", [userId, postId]);
      cheered = false;
    } else {
      await query("INSERT INTO post_cheers (user_id, post_id) VALUES ($1, $2)", [userId, postId]);
      cheered = true;
    }

    const countRes = await query("SELECT COUNT(*) AS count FROM post_cheers WHERE post_id=$1", [postId]);
    const count = Number(countRes.rows[0].count);

    res.json({ ok: true, cheered, count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "응원 처리 실패" });
  }
});

// GET 챌린지 응원 상태
router.get("/challenges/:id/cheers", async (req, res) => {
  const { userId } = req.query;
  const { id: challengeId } = req.params;

  try {
    // 1. 챌린지 포스트 가져오기
    let postRes = await query(
      "SELECT post_id FROM posts WHERE challenge_id=$1 AND user_id=$2 LIMIT 1",
      [challengeId, userId || null]
    );

    if (postRes.rows.length === 0) {
      return res.json({ ok: true, cheered: false, count: 0 });
    }

    const postId = postRes.rows[0].post_id;

    const countRes = await query("SELECT COUNT(*) AS count FROM post_cheers WHERE post_id=$1", [postId]);
    const userRes = userId
      ? await query("SELECT 1 FROM post_cheers WHERE user_id=$1 AND post_id=$2", [userId, postId])
      : { rows: [] };

    res.json({
      ok: true,
      cheered: userRes.rows.length > 0,
      count: Number(countRes.rows[0].count),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "응원 조회 실패" });
  }
});

// 1️⃣ 특정 챌린지의 인증 글 조회
router.get("/challenges/:id/posts", async (req, res) => {
  const { id: challengeId } = req.params;
  try {
    const result = await query(
      `SELECT p.post_id, p.content, p.user_id, u.username, p.created_at
       FROM posts p
       JOIN users u ON p.user_id = u.user_id
       WHERE p.challenge_id = $1
       ORDER BY p.created_at DESC`,
      [challengeId]
    );
    res.json({ ok: true, posts: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "게시글 조회 실패" });
  }
});

// 2️⃣ 인증 글 작성
router.post("/challenges/:id/posts", async (req, res) => {
  const { id: challengeId } = req.params;
  const { userId, content } = req.body;

  if (!userId || !content) return res.status(400).json({ ok: false, message: "내용이 필요합니다." });

  try {
    const result = await query(
      `INSERT INTO posts (content, user_id, challenge_id)
       VALUES ($1, $2, $3) RETURNING *`,
      [JSON.stringify(content), userId, challengeId]
    );
    res.json({ ok: true, post: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "게시글 작성 실패" });
  }
});

export default router;
