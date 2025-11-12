// src/worker/geminiWorker.js
// Gemini API 기반 태그 추출 Worker
import 'dotenv/config';
import { ai, model } from '../utils/geminiAPI.js';
import { TAG_SCHEMA } from '../utils/geminiSchema.js';
import { query } from '../db/pool.js';
import { upsertUserTag } from '../db/userTag.db.js';
import { extractionText } from '../utils/extractionText.js';

/** pending 상태의 job 가져오기 + 상태 갱신 */
async function takeJobs(batch = 5) {
  const sql = `
    WITH picked AS (
      SELECT job_id
      FROM tag_jobs
      WHERE status = 'pending'
      ORDER BY created_at
      LIMIT $1
      FOR UPDATE SKIP LOCKED
    )
    UPDATE tag_jobs j
    SET status = 'processing', attempt = j.attempt+1, updated_at = now()
    FROM picked
    WHERE j.job_id = picked.job_id
    RETURNING j.*;`;
  const { rows } = await query(sql, [batch]);
  return rows;
}

/** 완료 상태 업데이트 */
async function setJobDone(job_id) {
  await query(
    `
    UPDATE tag_jobs 
    SET status = 'done', updated_at = now() 
    WHERE job_id = $1`,
    [job_id]
  );
}

/** Retyr / Error */
async function setJobRetryOrError(job_id, attempt, errMsg) {
  const status = attempt >= 3 ? 'error' : 'pending';
  await query(
    `
    UPDATE tag_jobs
    SET status = $2, last_error = $3, updated_at = now()
    WHERE job_id = $1`,
    [job_id, status, String(errMsg).slice(0, 500)]
  );
}

/** Gemini API 호출 */
async function inferTagByGemini(text) {
  /** Gemini API response 규칙 */
  const systemInstruction = [
    '역할: 학습 인증글에서 과목/강사/개념 관련 "짧은 태그"만 추출한다.',
    '- 모르면 추측하지 말고 제외한다.',
    '- 욕설/비방/개인정보/URL/이모지/기호는 절대 포함하지 않는다.',
    '- 결과는 JSON 배열로만, 최대 5개.',
  ].join('\n');

  const response = await ai.models.generateContent({
    model: model,
    contents: [{ role: 'user', parts: [{ text: `다음 텍스트에서 관련 태그만 추출: \n\n${text}` }] }],
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseJsonSchema: TAG_SCHEMA,
    },
  });

  let tags;

  try {
    tags = JSON.parse(response.text);
  } catch {
    tags = [];
  }
  // tags 출력 예시: [ '정규근사', '신뢰구간', '확통', '박통계', '카이제곱 검정' ]
  return Array.isArray(tags) ? tags.map((t) => String(t).trim()).filter(Boolean) : [];
}

/** tag 추출 진행 */
async function processJob(job) {
  /** 인증글 텍스트 */
  const { rows } = await query(`SELECT content FROM posts WHERE post_id = $1`, [job.post_id]);
  const text = extractionText(rows[0]?.content ?? {});

  /** 태그 추출 */
  const tags = await inferTagByGemini(text);

  /** 추출한 tag를 db에 업로드 */
  for (const t of tags) {
    if (!t) continue;
    await upsertUserTag({ user_id: job.user_id, tag: t, delta: 1.0 });
  }

  /** 완료 */
  await setJobDone(job.job_id);
}

/** loop */
async function loop() {
  while (true) {
    const jobs = await takeJobs(5);
    if (jobs.length === 0) {
      await new Promise((r) => setTimeout(r, 1500));
      continue;
    }
    for (const j of jobs) {
      try {
        await processJob(j);
      } catch (error) {
        await setJobRetryOrError(j.job_id, j.attempt, error?.message || error);
      }
    }
  }
}

loop().catch((error) => {
  console.error('Gemini worker crashed: ', error);
  process.exit(1);
});
