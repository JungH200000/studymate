-- post table에 index 추가 (25-10-29)

BEGIN;

create index if not exists post_idx on posts (user_id, challenge_id, created_at DESC);

COMMIT;