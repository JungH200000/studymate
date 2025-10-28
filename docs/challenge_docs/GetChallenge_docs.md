# `GET /api/challenges`

- `Authorization: Bearer <accessToken>`을 헤더로 보내야 함

## 성공

- "author_id": 챌린지 작성자 id
- "author_username": 챌린지 작성자 username
- "joined_by_me": 로그인한 사용자의 챌린지 참여 여부
- "participant_count": 챌린지 참여 유저 수
- "liked_by_me": 로그인한 사용자의 챌린지 좋아요 여부
- "like_count": 챌린지 좋아요 수
- "post_count": 챌린지 인증글 수
- "participant_user" : 챌린지 참여 유저 목록
  - 없으면 [](빈 배열) 반환
  - "participant_user_id" : 챌린지에 참여한 유저의 user_id
  - "participant_username" : 챌린지에 참여한 유저의 username

```json
{
  "ok": true,
  "user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
  "pageNum": 1,
  "limitNum": 10,
  "offset": 0,
  "challengesList": [
    {
      "challenge_id": "fe898210-f4c7-45e8-a836-632a620c66b5",
      "title": "백준 알고리즘 1문제",
      "content": "코테 합격을 위하여",
      "frequency_type": "weekly",
      "target_per_week": 3,
      "start_date": "2025-10-27T15:00:00.000Z",
      "end_date": "2025-11-06T15:00:00.000Z",
      "created_at": "2025-10-28T02:35:21.734Z",
      "creator_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
      "author_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
      "author_username": "1234",
      "joined_by_me": true,
      "participant_count": 2,
      "liked_by_me": true,
      "like_count": 1,
      "post_count": 0,
      "participant_user": [
        {
          "participant_user_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
          "participant_username": "1234"
        },
        {
          "participant_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "participant_username": "park"
        }
      ],
      "like_user": [
        {
          "like_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "like_username": "park"
        }
      ]
    },
    {
      "challenge_id": "58278248-b977-4cf7-a7b6-21f5bd1c9a16",
      "title": "알고리즘 ",
      "content": "알고리즘 관련 1문제를 풀음.",
      "frequency_type": "daily",
      "target_per_week": null,
      "start_date": "2025-10-28T15:00:00.000Z",
      "end_date": null,
      "created_at": "2025-10-28T02:34:14.939Z",
      "creator_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
      "author_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
      "author_username": "지훈",
      "joined_by_me": false,
      "participant_count": 0,
      "liked_by_me": false,
      "like_count": 0,
      "post_count": 0,
      "participant_user": [],
      "like_user": []
    },
    {
      "challenge_id": "2c657b10-c5c9-4dd9-82e0-f3e9ae8c28d5",
      "title": "독서",
      "content": "책읽기",
      "frequency_type": "weekly",
      "target_per_week": 1,
      "start_date": "2025-10-28T15:00:00.000Z",
      "end_date": "2025-11-18T15:00:00.000Z",
      "created_at": "2025-10-27T04:18:41.168Z",
      "creator_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
      "author_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
      "author_username": "지훈",
      "joined_by_me": false,
      "participant_count": 0,
      "liked_by_me": false,
      "like_count": 0,
      "post_count": 0,
      "participant_user": [],
      "like_user": []
    },
    {
      "challenge_id": "ee787c9b-0e79-4daa-b115-550fcba98800",
      "title": "과학",
      "content": "실험완료",
      "frequency_type": "weekly",
      "target_per_week": 4,
      "start_date": "2025-10-22T15:00:00.000Z",
      "end_date": "2025-10-29T15:00:00.000Z",
      "created_at": "2025-10-27T01:29:08.445Z",
      "creator_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
      "author_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
      "author_username": "testUser1",
      "joined_by_me": true,
      "participant_count": 1,
      "liked_by_me": false,
      "like_count": 0,
      "post_count": 0,
      "participant_user": [
        {
          "participant_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "participant_username": "park"
        }
      ],
      "like_user": []
    },
    {
      "challenge_id": "293caa25-4aa4-4cd4-b462-99c71f544039",
      "title": "테스트 글",
      "content": "내용123",
      "frequency_type": "daily",
      "target_per_week": null,
      "start_date": "2025-10-26T15:00:00.000Z",
      "end_date": "2025-10-30T15:00:00.000Z",
      "created_at": "2025-10-24T06:08:49.488Z",
      "creator_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
      "author_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
      "author_username": "testUser1",
      "joined_by_me": false,
      "participant_count": 0,
      "liked_by_me": false,
      "like_count": 0,
      "post_count": 0,
      "participant_user": [],
      "like_user": []
    },
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
      "participant_count": 0,
      "liked_by_me": false,
      "like_count": 0,
      "post_count": 0,
      "participant_user": [],
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
    },
    {
      "challenge_id": "e6ee4a78-6bd7-4412-b71d-40ce28cdf886",
      "title": "운전면허시험 1급",
      "content": "너무 비싼데",
      "frequency_type": "weekly",
      "target_per_week": 3,
      "start_date": "2025-10-23T15:00:00.000Z",
      "end_date": "2025-12-24T15:00:00.000Z",
      "created_at": "2025-10-24T05:01:52.200Z",
      "creator_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
      "author_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
      "author_username": "park",
      "joined_by_me": false,
      "participant_count": 2,
      "liked_by_me": false,
      "like_count": 1,
      "post_count": 0,
      "participant_user": [
        {
          "participant_user_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
          "participant_username": "1234"
        },
        {
          "participant_user_id": "4b8388bf-281a-4a3f-a5e8-1e4cdb5cc827",
          "participant_username": "hyun"
        }
      ],
      "like_user": [
        {
          "like_user_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
          "like_username": "1234"
        }
      ]
    },
    {
      "challenge_id": "113ac2d6-89c9-4411-ad27-ac827d32dd2b",
      "title": "경제 뉴스레터 읽기",
      "content": "꾸준히!",
      "frequency_type": "weekly",
      "target_per_week": 4,
      "start_date": "2025-10-23T15:00:00.000Z",
      "end_date": null,
      "created_at": "2025-10-24T05:00:32.732Z",
      "creator_id": "4b8388bf-281a-4a3f-a5e8-1e4cdb5cc827",
      "author_id": "4b8388bf-281a-4a3f-a5e8-1e4cdb5cc827",
      "author_username": "hyun",
      "joined_by_me": false,
      "participant_count": 1,
      "liked_by_me": false,
      "like_count": 0,
      "post_count": 0,
      "participant_user": [
        {
          "participant_user_id": "4b8388bf-281a-4a3f-a5e8-1e4cdb5cc827",
          "participant_username": "hyun"
        }
      ],
      "like_user": []
    },
    {
      "challenge_id": "106a5e7c-2199-458d-bb19-ae3bd117bbfd",
      "title": "경제 뉴스레터 읽기",
      "content": "매일매일 읽읍시다.",
      "frequency_type": "daily",
      "target_per_week": null,
      "start_date": "2025-10-23T15:00:00.000Z",
      "end_date": null,
      "created_at": "2025-10-24T04:58:47.555Z",
      "creator_id": "e9b76740-4002-4094-8d84-9f2690cda4a8",
      "author_id": "e9b76740-4002-4094-8d84-9f2690cda4a8",
      "author_username": "jung",
      "joined_by_me": false,
      "participant_count": 0,
      "liked_by_me": true,
      "like_count": 2,
      "post_count": 2,
      "participant_user": [],
      "like_user": [
        {
          "like_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "like_username": "park"
        },
        {
          "like_user_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
          "like_username": "1234"
        }
      ]
    }
  ]
}
```
