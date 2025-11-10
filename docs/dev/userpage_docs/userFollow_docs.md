# 사용자 follow

- `Authorization: Bearer <accessToken>`을 헤더로 보내야 함
- `follower_id` : 팔로우 하는 사람
- `followee_id` : 팔로우 받는 사람

## 팔로우 : `POST /api/users/:id/follow`

### 성공

```json
{
  "ok": true,
  "followResult": {
    "follow_by_me": true,
    "follower_count": 2, // 팔로우 당한 타 사용자의 팔로워 수 증가
    "created": true
  }
}
```

## 언팔로우 : `DELETE /api/users/:id/follow`

### 성공

```json
{
  "ok": true,
  "followResult": {
    "follow_by_me": false,
    "follower_count": 1, // 언팔로우 당한 타 사용자의 팔로워 수 증가
    "deleted": true
  }
}
```

## 팔로워 목록 : `GET /api/users/:id/followers`

- 나를 팔로우한 사용자들

### 성공

```json
{
  "ok": true,
  "followerList": [
    {
      "user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
      "username": "지훈",
      "followed_at": "2025-10-31T07:33:20.816Z"
    }
  ],
  "followerCount": 1
}
```

## 팔로잉 목록 : `GET /api/users/:id/followings`

- 내가 팔로우한 사용자들

### 성공

```json
{
  "ok": true,
  "followingList": [
    {
      "followername": "jung",
      "follower_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
      "followee_id": "e9b76740-4002-4094-8d84-9f2690cda4a8",
      "created_at": "2025-10-31T07:30:59.040Z"
    },
    {
      "followername": "testUser1",
      "follower_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
      "followee_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
      "created_at": "2025-10-31T07:24:42.097Z"
    }
  ],
  "followingCount": 2
}
```
