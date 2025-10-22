-- created Supabase SQL Editor (2025-10-20)
BEGIN;

create extension if not exists "pgcrypto";
create extension if not exists pg_trgm;

-- drop table reports;
-- drop table challenge_likes;
-- drop table post_cheers;
-- drop table follows;
-- drop table participation;
-- drop table posts;
-- drop table challenges;
-- drop table refresh_tokens;
-- drop table users;

-- 1) USERS
create table if not exists users (
	user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	email TEXT NOT NULL UNIQUE,
	password_hash TEXT NOT NULL,
	username TEXT NOT NULL UNIQUE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- 로그인/세션 관리용
create table if not exists refresh_tokens (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
	token_hash TEXT NOT NULL UNIQUE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	expires_at TIMESTAMPTZ NOT NULL, -- token 만료 시각(자동 종료) -> 매 요청 시 지났는지 확인
	revoked_at TIMESTAMPTZ -- 강제 만료(로그아웃/유출 등)
);

create index if not exists refresh_tokens_user_idx ON refresh_tokens(user_id);
create index if not exists refresh_tokens_expires_idx ON refresh_tokens(expires_at);

-- 2) CHALLENGES
create table if not exists challenges (
	challenge_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	title TEXT NOT NULL,
	content TEXT,
	frequency_type TEXT NOT NULL CHECK (frequency_type IN ('daily', 'weekly')),
	target_per_week INT CHECK (target_per_week >= 1), -- `weekly`일 때만 사용
	start_date DATE NOT NULL,
	end_date DATE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	creator_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
	-- `DELETE CASCADE`: 부모 테이블의 데이터 삭제될 때 그와 연결된 자식 테이블의 데이터도 같이 삭제되게 설정
	constraint challenges_freq_rule CHECK(
		(frequency_type='weekly' AND target_per_week IS NOT NULL AND target_per_week >=1)
		OR
		(frequency_type='daily' AND target_per_week IS NULL)
	)
);

-- 마이페이지용(등록한 챌린지 목록)
create index if not exists challenges_creator_idx ON challenges (creator_id, created_at DESC);

-- 검색용 (title만)
create index if not exists challenges_title_trgm_idx ON challenges USING gin (title gin_trgm_ops);


-- 3) PARTICIPATION (users-challenges M:N)
create table if not exists participation (
	user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
	challenge_id UUID NOT NULL REFERENCES challenges(challenge_id) ON DELETE CASCADE,
	join_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	PRIMARY KEY(user_id, challenge_id)
);

-- 마이페이지용(참여한 챌린지 목록)
create index if not exists participation_challenge_idx ON participation (challenge_id);

create index if not exists participation_user_idx ON participation (user_id, join_at DESC);

-- 4) POSTS (인증 필드)
create table if not exists posts (
	post_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	content JSONB NOT NULL DEFAULT '{}'::jsonb,
	user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
	challenge_id UUID NOT NULL REFERENCES challenges(challenge_id) ON DELETE CASCADE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 피드용
-- WHERE challenge_id? ORDER BY created_at DESC LIMIT 20
create index if not exists post_challenge_idx on posts (challenge_id, created_at DESC);

-- WHERE user_id=? ORDER BY created_at DESC LIMIT 20
create index if not exists post_user_idx on posts (user_id, created_at DESC);


-- 5) CHALLENGE_LIKES와 POST_CHEERS
create table if not exists challenge_likes (
	user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
	challenge_id UUID NOT NULL REFERENCES challenges(challenge_id) ON DELETE CASCADE,
	created_at TIMESTAMPTZ DEFAULT now(),
	PRIMARY KEY (user_id, challenge_id)
);
create table if not exists post_cheers (
	user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
	post_id UUID NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
	created_at TIMESTAMPTZ DEFAULT now(),
	PRIMARY KEY (user_id, post_id)
);

create index if not exists challenge_likes_challenge_idx ON challenge_likes (challenge_id);
create index if not exists post_cheers_post_idx ON post_cheers (post_id);

-- 7) FOLLOWS
create table if not exists follows (
	follower_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, -- 팔로우 하는 쪽
	followee_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, -- 팔로우 받는 쪽
	created_at TIMESTAMPTZ DEFAULT now(),
	CONSTRAINT follows_pk PRIMARY KEY (follower_id, followee_id), -- 한 번만 팔로우
	CONSTRAINT follows_no_self CHECK (follower_id <> followee_id) -- 자시 자신 팔로우 금지
);

create index if not exists follower_idx ON follows (follower_id, created_at DESC);
create index if not exists followee_idx ON follows (followee_id, created_at DESC);


-- 8) REPORTS
create table if not exists reports (
	report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	reporter_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, -- 신고한 유저
	target_type TEXT NOT NULL CHECK(target_type IN ('challenge', 'post')), -- 어떤 종류를 신고?
	target_id UUID NOT NULL,
	content TEXT NOT NULL, -- 신고 사유
	created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

create index if not exists reports_target_idx ON reports (target_type, target_id);

COMMIT;
