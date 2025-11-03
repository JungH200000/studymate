# 챌린지/사용자 검색

## 챌린지 검색 : `GET /api/challenges?q=검색어

- 참고: q가 없을 때는 `GET /api/challenges`와 동일하게 동작(전체 챌린지 출력됨)

### 성공

- response

```json
{
  "ok": true,
  "user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
  "q": "특강",
  "pageNum": 1,
  "limitNum": 10,
  "offset": 0,
  "challengesList": [
    {
      "challenge_id": "9cced7c8-ef3b-4ed1-9ec7-379819fb3952",
      "title": "수능특강 수학 1회독",
      "content": "수능이 얼마 안 남았다...",
      "frequency_type": "daily",
      "target_per_week": null,
      "start_date": "2025-10-23T15:00:00.000Z",
      "end_date": "2025-11-06T15:00:00.000Z",
      "created_at": "2025-10-24T05:40:22.393Z",
      "creator_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
      "author_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
      "author_username": "1234",
      "joined_by_me": false,
      "participant_count": 1,
      "liked_by_me": false,
      "like_count": 0,
      "post_count": 0,
      "participant_user": [
        {
          "participant_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "participant_username": "지훈"
        }
      ],
      "like_user": []
    },
    {
      "challenge_id": "2328b4b5-a3b6-498c-81a0-54013a5a8d05",
      "title": "수능특강 영어 1회독",
      "content": "힘들어",
      "frequency_type": "weekly",
      "target_per_week": 5,
      "start_date": "2025-10-23T15:00:00.000Z",
      "end_date": "2025-11-06T15:00:00.000Z",
      "created_at": "2025-10-24T05:36:16.106Z",
      "creator_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
      "author_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
      "author_username": "1234",
      "joined_by_me": false,
      "participant_count": 0,
      "liked_by_me": true,
      "like_count": 1,
      "post_count": 0,
      "participant_user": [],
      "like_user": [
        {
          "like_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "like_username": "park"
        }
      ]
    }
  ]
}
```

## 사용자 검색 : `GET /api/users?q=검색어

- 참고: q가 없을 때는 전체 사용자가 출력됨

### 성공

```json
{
  "ok": true,
  "q": "u",
  "pageNum": 1,
  "limitNum": 10,
  "offset": 0,
  "searchUsers": [
    {
      "user_id": "4b8388bf-281a-4a3f-a5e8-1e4cdb5cc827",
      "username": "hyun",
      "created_at": "2025-10-24T04:59:22.725Z"
    },
    {
      "user_id": "e9b76740-4002-4094-8d84-9f2690cda4a8",
      "username": "jung",
      "created_at": "2025-10-24T04:58:06.434Z"
    },
    {
      "user_id": "de6c73e7-2ef0-44be-a1b9-111af4a7cc71",
      "username": "TesetUser3",
      "created_at": "2025-10-24T02:05:48.494Z"
    },
    {
      "user_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
      "username": "testUser1",
      "created_at": "2025-10-23T06:17:26.207Z"
    },
    {
      "user_id": "463b5074-677f-4390-ae36-be1508d50c03",
      "username": "testUser2",
      "created_at": "2025-10-23T07:40:03.161Z"
    },
    {
      "user_id": "df4c469a-fb9a-46f4-8f24-9ee4a6871f4e",
      "username": "TestUser4",
      "created_at": "2025-10-24T04:52:06.015Z"
    }
  ]
}
```
