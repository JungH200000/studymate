# 사용자가 생성/참여한 챌린지

- `Authorization: Bearer <accessToken>`을 헤더로 보내야 함
- 챌린지와 인증글 목록을 불러올 때 해당 글의 작성자의 user_id와 username을 함께 가져왔었음
- `joined_by_me`와 `liked_by_me`는 로그인 중인 본인이 챌린지에 참여 유무와 좋아요 유무를 나타냄(타 사용자 페이지에서도 마찬가지)

## 본인 : `GET /api/me/challenges?type=??`

### type=created

- response

```json
{
  "ok": true,
  "user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
  "viewer_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
  "type": "joined",
  "pageNum": 1,
  "limitNum": 20,
  "offset": 0,
  "challengesList": [
    {
      "challenge_id": "433f49ad-e80e-4d60-883c-c747f629f2b7",
      "title": "국어 파이널 모의고사",
      "content": "수능 D-15",
      "frequency_type": "weekly",
      "target_per_week": 3,
      "start_date": "2025-10-27T15:00:00.000Z",
      "end_date": "2025-11-09T15:00:00.000Z",
      "created_at": "2025-10-29T02:06:11.268Z",
      "creator_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
      "joined_by_me": true,
      "participant_count": 4,
      "liked_by_me": false,
      "like_count": 2,
      "post_count": 6,
      "participant_user": [
        {
          "participant_user_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
          "participant_username": "1234"
        },
        {
          "participant_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "participant_username": "park"
        },
        {
          "participant_user_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
          "participant_username": "testUser1"
        },
        {
          "participant_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "participant_username": "지훈"
        }
      ],
      "like_user": [
        {
          "like_user_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
          "like_username": "testUser1"
        },
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "지훈"
        }
      ]
    },
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
      "joined_by_me": true,
      "participant_count": 4,
      "liked_by_me": true,
      "like_count": 3,
      "post_count": 0,
      "participant_user": [
        {
          "participant_user_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
          "participant_username": "1234"
        },
        {
          "participant_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "participant_username": "park"
        },
        {
          "participant_user_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
          "participant_username": "testUser1"
        },
        {
          "participant_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "participant_username": "지훈"
        }
      ],
      "like_user": [
        {
          "like_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "like_username": "park"
        },
        {
          "like_user_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
          "like_username": "testUser1"
        },
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "지훈"
        }
      ]
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
      "joined_by_me": true,
      "participant_count": 3,
      "liked_by_me": false,
      "like_count": 1,
      "post_count": 1,
      "participant_user": [
        {
          "participant_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "participant_username": "park"
        },
        {
          "participant_user_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
          "participant_username": "testUser1"
        },
        {
          "participant_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "participant_username": "지훈"
        }
      ],
      "like_user": [
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "지훈"
        }
      ]
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
      "joined_by_me": true,
      "participant_count": 2,
      "liked_by_me": false,
      "like_count": 1,
      "post_count": 1,
      "participant_user": [
        {
          "participant_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "participant_username": "park"
        },
        {
          "participant_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "participant_username": "지훈"
        }
      ],
      "like_user": [
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "지훈"
        }
      ]
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
      "joined_by_me": true,
      "participant_count": 1,
      "liked_by_me": true,
      "like_count": 2,
      "post_count": 4,
      "participant_user": [
        {
          "participant_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "participant_username": "park"
        }
      ],
      "like_user": [
        {
          "like_user_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
          "like_username": "1234"
        },
        {
          "like_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "like_username": "park"
        }
      ]
    }
  ]
}
```

### type=joined

```json
{
  "ok": true,
  "user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
  "viewer_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
  "type": "joined",
  "pageNum": 1,
  "limitNum": 20,
  "offset": 0,
  "challengesList": [
    {
      "challenge_id": "433f49ad-e80e-4d60-883c-c747f629f2b7",
      "title": "국어 파이널 모의고사",
      "content": "수능 D-15",
      "frequency_type": "weekly",
      "target_per_week": 3,
      "start_date": "2025-10-27T15:00:00.000Z",
      "end_date": "2025-11-09T15:00:00.000Z",
      "created_at": "2025-10-29T02:06:11.268Z",
      "creator_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
      "joined_by_me": true,
      "participant_count": 4,
      "liked_by_me": false,
      "like_count": 2,
      "post_count": 6,
      "participant_user": [
        {
          "participant_user_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
          "participant_username": "1234"
        },
        {
          "participant_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "participant_username": "park"
        },
        {
          "participant_user_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
          "participant_username": "testUser1"
        },
        {
          "participant_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "participant_username": "지훈"
        }
      ],
      "like_user": [
        {
          "like_user_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
          "like_username": "testUser1"
        },
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "지훈"
        }
      ]
    },
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
      "joined_by_me": true,
      "participant_count": 4,
      "liked_by_me": true,
      "like_count": 3,
      "post_count": 0,
      "participant_user": [
        {
          "participant_user_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
          "participant_username": "1234"
        },
        {
          "participant_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "participant_username": "park"
        },
        {
          "participant_user_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
          "participant_username": "testUser1"
        },
        {
          "participant_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "participant_username": "지훈"
        }
      ],
      "like_user": [
        {
          "like_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "like_username": "park"
        },
        {
          "like_user_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
          "like_username": "testUser1"
        },
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "지훈"
        }
      ]
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
      "joined_by_me": true,
      "participant_count": 3,
      "liked_by_me": false,
      "like_count": 1,
      "post_count": 1,
      "participant_user": [
        {
          "participant_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "participant_username": "park"
        },
        {
          "participant_user_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
          "participant_username": "testUser1"
        },
        {
          "participant_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "participant_username": "지훈"
        }
      ],
      "like_user": [
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "지훈"
        }
      ]
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
      "joined_by_me": true,
      "participant_count": 2,
      "liked_by_me": false,
      "like_count": 1,
      "post_count": 1,
      "participant_user": [
        {
          "participant_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "participant_username": "park"
        },
        {
          "participant_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "participant_username": "지훈"
        }
      ],
      "like_user": [
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "지훈"
        }
      ]
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
      "joined_by_me": true,
      "participant_count": 1,
      "liked_by_me": true,
      "like_count": 2,
      "post_count": 4,
      "participant_user": [
        {
          "participant_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "participant_username": "park"
        }
      ],
      "like_user": [
        {
          "like_user_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
          "like_username": "1234"
        },
        {
          "like_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "like_username": "park"
        }
      ]
    }
  ]
}
```

## 상대방 : `GET /api/users/:id/challenges?type=??`

### type=created

- viewer_id : 현재 로그인 중인 사용자 본인
- user_id : 내가 보고 있는 사용자 페이즤의 사용자(타 사용자)

```json
{
  "ok": true,
  "viewer_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
  "user_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
  "type": "created",
  "pageNum": 1,
  "limitNum": 20,
  "offset": 0,
  "challengesList": [
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
      "joined_by_me": true,
      "participant_count": 2,
      "liked_by_me": false,
      "like_count": 1,
      "post_count": 1,
      "participant_user": [
        {
          "participant_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "participant_username": "park"
        },
        {
          "participant_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "participant_username": "지훈"
        }
      ],
      "like_user": [
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "지훈"
        }
      ]
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
    }
  ]
}
```

### type=joined

```json
{
  "ok": true,
  "viewer_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
  "user_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
  "type": "joined",
  "pageNum": 1,
  "limitNum": 20,
  "offset": 0,
  "challengesList": [
    {
      "challenge_id": "f1d5449d-fe9a-4569-b086-f90a532400d9",
      "title": "기하와 벡터",
      "content": "문제집3장 풀기",
      "frequency_type": "daily",
      "target_per_week": null,
      "start_date": "2025-10-28T15:00:00.000Z",
      "end_date": null,
      "created_at": "2025-10-29T02:30:56.207Z",
      "creator_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
      "joined_by_me": false,
      "participant_count": 3,
      "liked_by_me": false,
      "like_count": 2,
      "post_count": 2,
      "participant_user": [
        {
          "participant_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "participant_username": "sw"
        },
        {
          "participant_user_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
          "participant_username": "testUser1"
        },
        {
          "participant_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "participant_username": "지훈"
        }
      ],
      "like_user": [
        {
          "like_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "like_username": "sw"
        },
        {
          "like_user_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
          "like_username": "testUser1"
        }
      ]
    },
    {
      "challenge_id": "433f49ad-e80e-4d60-883c-c747f629f2b7",
      "title": "국어 파이널 모의고사",
      "content": "수능 D-15",
      "frequency_type": "weekly",
      "target_per_week": 3,
      "start_date": "2025-10-27T15:00:00.000Z",
      "end_date": "2025-11-09T15:00:00.000Z",
      "created_at": "2025-10-29T02:06:11.268Z",
      "creator_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
      "joined_by_me": true,
      "participant_count": 4,
      "liked_by_me": false,
      "like_count": 2,
      "post_count": 6,
      "participant_user": [
        {
          "participant_user_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
          "participant_username": "1234"
        },
        {
          "participant_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "participant_username": "park"
        },
        {
          "participant_user_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
          "participant_username": "testUser1"
        },
        {
          "participant_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "participant_username": "지훈"
        }
      ],
      "like_user": [
        {
          "like_user_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
          "like_username": "testUser1"
        },
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "지훈"
        }
      ]
    },
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
      "joined_by_me": true,
      "participant_count": 4,
      "liked_by_me": true,
      "like_count": 3,
      "post_count": 0,
      "participant_user": [
        {
          "participant_user_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
          "participant_username": "1234"
        },
        {
          "participant_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "participant_username": "park"
        },
        {
          "participant_user_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
          "participant_username": "testUser1"
        },
        {
          "participant_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "participant_username": "지훈"
        }
      ],
      "like_user": [
        {
          "like_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "like_username": "park"
        },
        {
          "like_user_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
          "like_username": "testUser1"
        },
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "지훈"
        }
      ]
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
      "joined_by_me": true,
      "participant_count": 3,
      "liked_by_me": false,
      "like_count": 1,
      "post_count": 1,
      "participant_user": [
        {
          "participant_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "participant_username": "park"
        },
        {
          "participant_user_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
          "participant_username": "testUser1"
        },
        {
          "participant_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "participant_username": "지훈"
        }
      ],
      "like_user": [
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "지훈"
        }
      ]
    }
  ]
}
```
