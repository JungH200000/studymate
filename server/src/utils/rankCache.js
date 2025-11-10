// src/utils/rankCache.js
export const rankCache = new Map();
// key : `rank:${viewer_id}`
// val : { at: number, map: Map<user_Id, position> } // position은 1부터
