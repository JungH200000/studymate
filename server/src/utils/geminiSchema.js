// src/utils/geminiSchema.js
// Gemini API 답변 고정용 Schema

/** 욕설·비방 검증 Gemini API Schema */
export const ABUSE_OBJECT_SCHEMA = {
  type: 'object',
  properties: {
    abuse: {
      type: 'boolean',
      description: '괴롭힘, 증오, 모욕, 욕설, 비방, 성적 노골성 또는 위협/폭력이 포함되어 있는 경우 true입니다.',
    },
    reasons: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['괴롭힘', '증오', '모욕', '욕설', '비방', '성적', '폭력적', '위험한'],
      },
    },
  },
  required: ['abuse', 'reasons'],
  additionalProperties: false,
};
