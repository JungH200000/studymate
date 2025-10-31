# 유저 정보

- `Authorization: Bearer <accessToken>`을 헤더로 보내야 함
- 챌린지와 인증글 목록을 불러올 때 해당 글의 작성자의 user_id와 username을 함께 가져왔었음

## 본인 : `GET /api/me`

- response

```json
{
  "ok": true,
  "user": {
    "user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
    "email": "park@naver.com",
    "username": "park",
    "created_at": "2025-10-24T05:00:55.652Z"
  }
}
```

## 상대방 : `GET /api/users/:id`

- response

```json
{
  "ok": true,
  "user": {
    "user_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
    "email": "1234@naver.com",
    "username": "1234",
    "created_at": "2025-10-24T05:33:28.835Z"
  }
}
```
