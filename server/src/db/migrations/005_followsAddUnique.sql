-- 005_followsAddUnique.sql
-- follows table에 unique 제약 추가

BEGIN;

ALTER TABLE follows
ADD CONSTRAINT uq_follows_follower_followee_id
UNIQUE (follower_id, followee_id);

COMMIT;