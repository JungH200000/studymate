// src/utils/extractionText.js
/** JSON에서 하나의 텍스트로 */
export function extractionText(content) {
  const text = (t) => {
    if (!t) return '';
    if (typeof t === 'string') return t;
    if (Array.isArray(t)) return t.map(text).join(' / ');
    if (typeof t === 'object') return Object.values(t).map(text).join(' / ');
    return '';
  };
  // console.log(text(content));
  return text(content).slice(0, 5000); // 토큰 과다 방지
}
