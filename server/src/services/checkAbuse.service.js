// src/services/checkAbuse.service.js
import { ai, model } from '../utils/geminiAPI.js';
import { ABUSE_OBJECT_SCHEMA } from '../utils/geminiSchema.js';

/** 욕설·비방 검증 With Gemini API */
export async function checkAbuseWithGemini(text) {
  const response = await ai.models.generateContent({
    model: model,
    contents:
      `다음 사용자가 입력한 텍스트에 괴롭힘, 증오, 모욕, 욕설, 비방, 성적 노골성 또는 위협 폭력이 포함되어 있는지 분류하세요.` +
      `제공된 스키마와 일치하는 JSON만 응답하세요.\n\nTEXT:\n${text}`,
    config: {
      temperature: 0,
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      ],
      responseMimeType: 'application/json',
      responseJsonSchema: ABUSE_OBJECT_SCHEMA,
    },
  });
  const result = JSON.parse(response.text);
  return result; // { abuse: true/false, reasons: ['string'] }
}
