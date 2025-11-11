-- 005_tags.sql
-- 추천 챌린지 기능을 위해 tag 관련 table 추가
BEGIN;

-- tag 가중치 table
CREATE TABLE IF NOT EXISTS user_tags (
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  weight REAL NOT NULL DEFAULT 1.0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, tag)
);

CREATE INDEX IF NOT EXISTS user_tags_user_id_idx ON user_tags (user_id);
CREATE INDEX IF NOT EXISTS user_tags_user_id_updatedAt_DESC_idx ON user_tags (user_id, updated_at DESC);

-- tag_jobs => PosgreSQL로 폴링 워커
-- 폴링 워커: PostgreSQL 테이블만 보고 작업할 것들이 있는지 주기적으로 폴링해서 처리하는 방식
-- 폴링 : 일정 시간마다 요청해서 확인하는 것

CREATE TABLE IF NOT EXISTS tag_jobs (
  job_id BIGSERIAL PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'done', 'error')),
  attempt INT NOT NULL DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS tag_jobs_status_idx ON tag_jobs (status, created_at);

COMMIT;