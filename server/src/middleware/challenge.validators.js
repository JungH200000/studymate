// src/utils/challenge.validators.js

/** title, frequency_type, start_date, target_per_week 검증 미들웨어 */
export async function validateCreateChallenges(req, res, next) {
  const { title, frequency_type, target_per_week, start_date } = req.body;

  // 1) title 검증
  if (!title) {
    return res.status(400).json({
      ok: false,
      code: 'VALIDATION_ERROR',
      message: 'title이 비어있습니다.',
    });
  }

  // 2) frequency_type과 start_date 검증
  if (!frequency_type || !start_date) {
    return res.status(400).json({
      ok: false,
      code: 'VALIDATION_ERROR',
      message: 'frequency_type과 start_date가 비어있습니다.',
    });
  }

  if (!['daily', 'weekly'].includes(frequency_type)) {
    return res.status(400).json({
      ok: false,
      code: 'INVALID_FREQUENCY',
      message: 'daily 또는 weekly만 허용됩니다.',
    });
  }

  // 3) frequency_type에 따른 target_per_week 검증
  const n = Number(target_per_week);
  if (frequency_type === 'daily') {
    if (target_per_week != null) {
      return res.status(400).json({
        ok: false,
        code: 'INVALID_FREQUENCY_COMBINATION',
        message: 'daily일 경우 target_per_week는 지정할 수 없습니다.',
      });
    }
  } else {
    // frequency_type === weekly
    if (target_per_week == null) {
      return res.status(400).json({
        ok: false,
        code: 'INVALID_FREQUENCY_COMBINATION',
        message: 'weekly에는 target_per_week가 필요합니다.',
      });
    }
    if (!Number.isInteger(n) || n < 1 || n > 7) {
      return res.status(400).json({
        ok: false,
        code: 'INVALID_TARGET_PER_WEEK',
        message: 'target_per_week는 1~7 사이의 정수이어야 합니다.',
      });
    }
  }

  next();
}
