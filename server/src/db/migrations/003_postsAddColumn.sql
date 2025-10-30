-- 003_postsAddColumn.sql
-- post table에 posted_date_kst column 추가 (25-10-29)

BEGIN;

ALTER TABLE posts 
ADD posted_date_kst date
NOT NULL
DEFAULT (now() AT TIME ZONE 'Asia/Seoul')::date;

ALTER TABLE posts
ADD CONSTRAINT uq_posts_user_chal_kstday
UNIQUE (user_id, challenge_id, posted_date_kst);

COMMIT;