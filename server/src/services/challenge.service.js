// src/services/challenge.service.js
// 비지니스 로직
import * as challengeDB from '../db/challenge.db.js';

export async function createChallenge({
  title,
  content,
  frequency_type,
  target_per_week,
  start_date,
  end_date,
  creator_id,
}) {
  const createdChallenge = challengeDB.createChallenge({
    title,
    content,
    frequency_type,
    target_per_week,
    start_date,
    end_date,
    creator_id,
  });

  return createdChallenge;
}
