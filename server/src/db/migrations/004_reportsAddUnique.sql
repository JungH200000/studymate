-- 004_reportsAddUnique.sql
-- reports table에 unique 제약 추가

BEGIN;

ALTER TABLE reports
ADD CONSTRAINT uq_reports_reporter_target_type_id
UNIQUE (reporter_id, target_type, target_id);

COMMIT;