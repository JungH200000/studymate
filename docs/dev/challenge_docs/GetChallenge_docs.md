# `GET /api/challenges`

- `Authorization: Bearer <accessToken>`을 헤더로 보내야 함

## `sort = newest`거나 없을 경우

### 성공

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
  "limitNum": 20,
  "offset": 0,
  "challengesList": [
    {
      "challenge_id": "b2b87492-537f-485a-8ffc-8537b72dae16",
      "title": "수학 킬러 문항 집중 분석",
      "content": {
        "tags": ["수학", "킬러문항", "30일챌린지"],
        "description": "30일 동안 매일 킬러/준킬러 문제 2개씩 풀고, 풀이 과정을 완벽하게 정리하기"
      },
      "frequency_type": "daily",
      "target_per_week": null,
      "start_date": "2025-11-10T15:00:00.000Z",
      "end_date": "2025-12-30T15:00:00.000Z",
      "created_at": "2025-11-11T01:33:15.232Z",
      "creator_id": "d038811c-48ce-4a71-93fe-12714c119996",
      "author_id": "d038811c-48ce-4a71-93fe-12714c119996",
      "author_username": "조진세",
      "joined_by_me": false,
      "participant_count": 2,
      "liked_by_me": false,
      "like_count": 2,
      "post_count": 1,
      "participant_user": [
        {
          "participant_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "participant_username": "박만주"
        },
        {
          "participant_user_id": "75d12804-2cd6-4d8a-9a1f-b9e6a54878b1",
          "participant_username": "임창정"
        }
      ],
      "like_user": [
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "박만주"
        },
        {
          "like_user_id": "d038811c-48ce-4a71-93fe-12714c119996",
          "like_username": "조진세"
        }
      ]
    },
    {
      "challenge_id": "62ee4486-b256-46b4-b013-ccbdbe4f8430",
      "title": "국어 문학 지문 읽기",
      "content": {
        "tags": ["국어", "문학"],
        "description": null
      },
      "frequency_type": "weekly",
      "target_per_week": 2,
      "start_date": "2025-11-09T15:00:00.000Z",
      "end_date": "2025-12-30T15:00:00.000Z",
      "created_at": "2025-11-10T07:17:46.019Z",
      "creator_id": "aa21511c-31e3-4cef-8c7b-f4f2da583634",
      "author_id": "aa21511c-31e3-4cef-8c7b-f4f2da583634",
      "author_username": "김상호",
      "joined_by_me": false,
      "participant_count": 5,
      "liked_by_me": false,
      "like_count": 3,
      "post_count": 7,
      "participant_user": [
        {
          "participant_user_id": "aa21511c-31e3-4cef-8c7b-f4f2da583634",
          "participant_username": "김상호"
        },
        {
          "participant_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "participant_username": "박만주"
        },
        {
          "participant_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "participant_username": "임수진"
        },
        {
          "participant_user_id": "156c5591-1d7b-445b-9d7a-1825868dc688",
          "participant_username": "정우주"
        },
        {
          "participant_user_id": "99314b17-5c92-4c49-9c45-4306033a6027",
          "participant_username": "홍길동"
        }
      ],
      "like_user": [
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "박만주"
        },
        {
          "like_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "like_username": "임수진"
        },
        {
          "like_user_id": "99314b17-5c92-4c49-9c45-4306033a6027",
          "like_username": "홍길동"
        }
      ]
    },
    {
      "challenge_id": "c1f7d807-7b63-403f-8935-31b900ce1795",
      "title": "매삼비 풀기",
      "content": {
        "tags": ["국어", "비문학"],
        "description": null
      },
      "frequency_type": "daily",
      "target_per_week": null,
      "start_date": "2025-11-08T15:00:00.000Z",
      "end_date": "2025-12-11T15:00:00.000Z",
      "created_at": "2025-11-10T06:55:05.040Z",
      "creator_id": "75d12804-2cd6-4d8a-9a1f-b9e6a54878b1",
      "author_id": "75d12804-2cd6-4d8a-9a1f-b9e6a54878b1",
      "author_username": "임창정",
      "joined_by_me": false,
      "participant_count": 3,
      "liked_by_me": false,
      "like_count": 3,
      "post_count": 3,
      "participant_user": [
        {
          "participant_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "participant_username": "박만주"
        },
        {
          "participant_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "participant_username": "임수진"
        },
        {
          "participant_user_id": "75d12804-2cd6-4d8a-9a1f-b9e6a54878b1",
          "participant_username": "임창정"
        }
      ],
      "like_user": [
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "박만주"
        },
        {
          "like_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "like_username": "임수진"
        },
        {
          "like_user_id": "75d12804-2cd6-4d8a-9a1f-b9e6a54878b1",
          "like_username": "임창정"
        }
      ]
    },
    {
      "challenge_id": "b7424310-a6ff-4d7e-9afb-af6b0520c652",
      "title": "영어 모의고사 듣기평가",
      "content": {
        "tags": ["영어", "듣기"],
        "description": null
      },
      "frequency_type": "daily",
      "target_per_week": null,
      "start_date": "2025-11-09T15:00:00.000Z",
      "end_date": "2025-12-11T15:00:00.000Z",
      "created_at": "2025-11-10T06:33:03.995Z",
      "creator_id": "99314b17-5c92-4c49-9c45-4306033a6027",
      "author_id": "99314b17-5c92-4c49-9c45-4306033a6027",
      "author_username": "홍길동",
      "joined_by_me": false,
      "participant_count": 5,
      "liked_by_me": false,
      "like_count": 4,
      "post_count": 6,
      "participant_user": [
        {
          "participant_user_id": "aa21511c-31e3-4cef-8c7b-f4f2da583634",
          "participant_username": "김상호"
        },
        {
          "participant_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "participant_username": "박만주"
        },
        {
          "participant_user_id": "75d12804-2cd6-4d8a-9a1f-b9e6a54878b1",
          "participant_username": "임창정"
        },
        {
          "participant_user_id": "d038811c-48ce-4a71-93fe-12714c119996",
          "participant_username": "조진세"
        },
        {
          "participant_user_id": "99314b17-5c92-4c49-9c45-4306033a6027",
          "participant_username": "홍길동"
        }
      ],
      "like_user": [
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "박만주"
        },
        {
          "like_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "like_username": "임수진"
        },
        {
          "like_user_id": "75d12804-2cd6-4d8a-9a1f-b9e6a54878b1",
          "like_username": "임창정"
        },
        {
          "like_user_id": "d038811c-48ce-4a71-93fe-12714c119996",
          "like_username": "조진세"
        }
      ]
    },
    {
      "challenge_id": "cb841157-33e8-4bdd-a21e-fe66c314d9fc",
      "title": "한국사검정능력시험 1급",
      "content": {
        "tags": ["tag1", "tag2"],
        "description": "한국사 공부"
      },
      "frequency_type": "daily",
      "target_per_week": null,
      "start_date": "2025-10-23T15:00:00.000Z",
      "end_date": null,
      "created_at": "2025-11-10T06:10:18.345Z",
      "creator_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
      "author_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
      "author_username": "박현",
      "joined_by_me": false,
      "participant_count": 2,
      "liked_by_me": false,
      "like_count": 3,
      "post_count": 1,
      "participant_user": [
        {
          "participant_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "participant_username": "임수진"
        },
        {
          "participant_user_id": "d038811c-48ce-4a71-93fe-12714c119996",
          "participant_username": "조진세"
        }
      ],
      "like_user": [
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "박만주"
        },
        {
          "like_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "like_username": "임수진"
        },
        {
          "like_user_id": "d038811c-48ce-4a71-93fe-12714c119996",
          "like_username": "조진세"
        }
      ]
    },
    {
      "challenge_id": "4f5d4633-943f-45dd-8d61-4fab2b54a018",
      "title": "독서/비문학 지문 분석",
      "content": null,
      "frequency_type": "weekly",
      "target_per_week": 4,
      "start_date": "2025-10-30T15:00:00.000Z",
      "end_date": "2025-12-30T15:00:00.000Z",
      "created_at": "2025-11-07T06:28:42.806Z",
      "creator_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
      "author_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
      "author_username": "박만주",
      "joined_by_me": false,
      "participant_count": 3,
      "liked_by_me": false,
      "like_count": 2,
      "post_count": 2,
      "participant_user": [
        {
          "participant_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "participant_username": "박만주"
        },
        {
          "participant_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "participant_username": "임수진"
        },
        {
          "participant_user_id": "d038811c-48ce-4a71-93fe-12714c119996",
          "participant_username": "조진세"
        }
      ],
      "like_user": [
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "박만주"
        },
        {
          "like_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "like_username": "임수진"
        }
      ]
    },
    {
      "challenge_id": "212a6b88-023d-4d2e-bbc4-3d99634008af",
      "title": "물I 수능특강 전체 복습",
      "content": null,
      "frequency_type": "daily",
      "target_per_week": null,
      "start_date": "2025-10-26T15:00:00.000Z",
      "end_date": "2025-12-30T15:00:00.000Z",
      "created_at": "2025-11-03T06:31:58.667Z",
      "creator_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
      "author_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
      "author_username": "이상",
      "joined_by_me": true,
      "participant_count": 4,
      "liked_by_me": false,
      "like_count": 3,
      "post_count": 12,
      "participant_user": [
        {
          "participant_user_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
          "participant_username": "testUser1"
        },
        {
          "participant_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "participant_username": "박만주"
        },
        {
          "participant_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "participant_username": "박현"
        },
        {
          "participant_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "participant_username": "임수진"
        }
      ],
      "like_user": [
        {
          "like_user_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
          "like_username": "testUser1"
        },
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "박만주"
        },
        {
          "like_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "like_username": "임수진"
        }
      ]
    },
    {
      "challenge_id": "6a921da8-04bb-47fa-8e7d-e1dbce5b136d",
      "title": "수능 영어 단어 복습",
      "content": null,
      "frequency_type": "daily",
      "target_per_week": null,
      "start_date": "2025-10-26T15:00:00.000Z",
      "end_date": "2025-12-30T15:00:00.000Z",
      "created_at": "2025-11-03T05:09:33.024Z",
      "creator_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
      "author_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
      "author_username": "이상",
      "joined_by_me": true,
      "participant_count": 4,
      "liked_by_me": false,
      "like_count": 2,
      "post_count": 11,
      "participant_user": [
        {
          "participant_user_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
          "participant_username": "testUser1"
        },
        {
          "participant_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "participant_username": "박현"
        },
        {
          "participant_user_id": "e9b76740-4002-4094-8d84-9f2690cda4a8",
          "participant_username": "이정한"
        },
        {
          "participant_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "participant_username": "임수진"
        }
      ],
      "like_user": [
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "박만주"
        },
        {
          "like_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "like_username": "임수진"
        }
      ]
    },
    {
      "challenge_id": "0520beb0-e07b-492e-8be3-ecd6d2b0dccc",
      "title": "수학 파이널 모의고사",
      "content": null,
      "frequency_type": "weekly",
      "target_per_week": 3,
      "start_date": "2025-10-26T15:00:00.000Z",
      "end_date": "2025-12-30T15:00:00.000Z",
      "created_at": "2025-11-03T05:08:07.777Z",
      "creator_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
      "author_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
      "author_username": "박현",
      "joined_by_me": true,
      "participant_count": 3,
      "liked_by_me": false,
      "like_count": 2,
      "post_count": 10,
      "participant_user": [
        {
          "participant_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "participant_username": "박만주"
        },
        {
          "participant_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "participant_username": "박현"
        },
        {
          "participant_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "participant_username": "임수진"
        }
      ],
      "like_user": [
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "박만주"
        },
        {
          "like_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "like_username": "임수진"
        }
      ]
    },
    {
      "challenge_id": "f1d5449d-fe9a-4569-b086-f90a532400d9",
      "title": "기하와 벡터",
      "content": null,
      "frequency_type": "daily",
      "target_per_week": null,
      "start_date": "2025-10-28T15:00:00.000Z",
      "end_date": null,
      "created_at": "2025-10-29T02:30:56.207Z",
      "creator_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
      "author_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
      "author_username": "임수진",
      "joined_by_me": false,
      "participant_count": 1,
      "liked_by_me": false,
      "like_count": 3,
      "post_count": 3,
      "participant_user": [
        {
          "participant_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "participant_username": "임수진"
        }
      ],
      "like_user": [
        {
          "like_user_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
          "like_username": "testUser1"
        },
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "박만주"
        },
        {
          "like_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "like_username": "임수진"
        }
      ]
    },
    {
      "challenge_id": "433f49ad-e80e-4d60-883c-c747f629f2b7",
      "title": "국어 파이널 모의고사",
      "content": null,
      "frequency_type": "weekly",
      "target_per_week": 3,
      "start_date": "2025-10-27T15:00:00.000Z",
      "end_date": "2025-12-30T15:00:00.000Z",
      "created_at": "2025-10-28T02:06:11.268Z",
      "creator_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
      "author_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
      "author_username": "박현",
      "joined_by_me": true,
      "participant_count": 2,
      "liked_by_me": false,
      "like_count": 3,
      "post_count": 7,
      "participant_user": [
        {
          "participant_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "participant_username": "박현"
        },
        {
          "participant_user_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
          "participant_username": "이상"
        }
      ],
      "like_user": [
        {
          "like_user_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
          "like_username": "testUser1"
        },
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "박만주"
        },
        {
          "like_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "like_username": "임수진"
        }
      ]
    },
    {
      "challenge_id": "9cced7c8-ef3b-4ed1-9ec7-379819fb3952",
      "title": "수능특강 수학 1회독",
      "content": null,
      "frequency_type": "daily",
      "target_per_week": null,
      "start_date": "2025-10-23T15:00:00.000Z",
      "end_date": "2025-12-30T15:00:00.000Z",
      "created_at": "2025-10-24T05:40:22.393Z",
      "creator_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
      "author_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
      "author_username": "이상",
      "joined_by_me": false,
      "participant_count": 1,
      "liked_by_me": false,
      "like_count": 2,
      "post_count": 3,
      "participant_user": [
        {
          "participant_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "participant_username": "박만주"
        }
      ],
      "like_user": [
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "박만주"
        },
        {
          "like_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "like_username": "임수진"
        }
      ]
    },
    {
      "challenge_id": "2328b4b5-a3b6-498c-81a0-54013a5a8d05",
      "title": "수능특강 영어 1회독",
      "content": null,
      "frequency_type": "weekly",
      "target_per_week": 5,
      "start_date": "2025-10-23T15:00:00.000Z",
      "end_date": "2025-12-30T15:00:00.000Z",
      "created_at": "2025-10-24T05:36:16.106Z",
      "creator_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
      "author_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
      "author_username": "이상",
      "joined_by_me": false,
      "participant_count": 1,
      "liked_by_me": true,
      "like_count": 3,
      "post_count": 1,
      "participant_user": [
        {
          "participant_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "participant_username": "박만주"
        }
      ],
      "like_user": [
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "박만주"
        },
        {
          "like_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "like_username": "박현"
        },
        {
          "like_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "like_username": "임수진"
        }
      ]
    }
  ]
}
```

## `sort = recommendation`일 경우

### 성공

```json
{
  "ok": true,
  "user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
  "pageNum": 1,
  "limitNum": 20,
  "offset": 0,
  "challengesList": [
    {
      "challenge_id": "626cc991-3a6b-4561-be7a-7de5fc15c7d6",
      "title": "수학 문제집 하루 2장",
      "content": {
        "tags": ["수학", "기하", "오답노트"],
        "description": "기하 파트 집중 풀이 (오답노트 병행)"
      },
      "frequency_type": "weekly",
      "target_per_week": 5,
      "start_date": "2025-11-02T15:00:00.000Z",
      "end_date": "2025-12-30T15:00:00.000Z",
      "created_at": "2025-11-03T04:04:02.611Z",
      "creator_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
      "author_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
      "author_username": "박현",
      "personal_score": 10,
      "joined_by_me": true,
      "participant_count": 1,
      "liked_by_me": false,
      "like_count": 0,
      "post_count": 3,
      "participant_user": [
        {
          "participant_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "participant_username": "박현"
        }
      ],
      "like_user": []
    },
    {
      "challenge_id": "97ef0730-ef45-4443-b2bd-44f136f69a6f",
      "title": "삼각함수 그래프·방정식 스프린트",
      "content": {
        "tags": ["수학", "삼각함수", "그래프", "방정식"],
        "description": "삼각함수 그래프(진폭/주기/위상 이동) 해석과 삼각방정식·부등식 풀이를 체계적으로 훈련"
      },
      "frequency_type": "weekly",
      "target_per_week": 4,
      "start_date": "2025-11-09T15:00:00.000Z",
      "end_date": null,
      "created_at": "2025-11-11T04:08:49.692Z",
      "creator_id": "4b8388bf-281a-4a3f-a5e8-1e4cdb5cc827",
      "author_id": "4b8388bf-281a-4a3f-a5e8-1e4cdb5cc827",
      "author_username": "강현수",
      "personal_score": 5,
      "joined_by_me": false,
      "participant_count": 0,
      "liked_by_me": false,
      "like_count": 1,
      "post_count": 0,
      "participant_user": [],
      "like_user": [
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "박민성"
        }
      ]
    },
    {
      "challenge_id": "fc183906-7749-43c5-8a86-dd01261bc193",
      "title": "수열·점화식 마스터",
      "content": {
        "tags": ["수학", "수열", "점화식", "귀납법"],
        "description": "등차/등비수열, 점화식, 수학적 귀납법을 매일 10문항 풀이"
      },
      "frequency_type": "daily",
      "target_per_week": null,
      "start_date": "2025-11-08T15:00:00.000Z",
      "end_date": null,
      "created_at": "2025-11-11T04:08:20.761Z",
      "creator_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
      "author_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
      "author_username": "이상",
      "personal_score": 5,
      "joined_by_me": false,
      "participant_count": 1,
      "liked_by_me": false,
      "like_count": 0,
      "post_count": 0,
      "participant_user": [
        {
          "participant_user_id": "e9b76740-4002-4094-8d84-9f2690cda4a8",
          "participant_username": "이정한"
        }
      ],
      "like_user": []
    },
    {
      "challenge_id": "ddb1914b-f337-4d49-baeb-f909532bd3f4",
      "title": "확률·통계 20제 실전",
      "content": {
        "tags": ["수학", "확률과통계", "확률분포", "통계추정"],
        "description": "확률분포와 통계적 추정 중심으로 주 4회 20문항 풀이 및 해설 요약"
      },
      "frequency_type": "weekly",
      "target_per_week": 4,
      "start_date": "2025-11-09T15:00:00.000Z",
      "end_date": "2025-12-30T15:00:00.000Z",
      "created_at": "2025-11-11T04:08:13.483Z",
      "creator_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
      "author_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
      "author_username": "이상",
      "personal_score": 5,
      "joined_by_me": true,
      "participant_count": 1,
      "liked_by_me": false,
      "like_count": 0,
      "post_count": 3,
      "participant_user": [
        {
          "participant_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "participant_username": "박현"
        }
      ],
      "like_user": []
    },
    {
      "challenge_id": "4f10a0eb-f951-4049-9c24-f1c2bfb70e96",
      "title": "수학(미적분) 개념 복습",
      "content": {
        "tags": ["수학", "미적분"],
        "description": "미분/적분 핵심 공식 복기 및 개념 문제 풀이"
      },
      "frequency_type": "weekly",
      "target_per_week": 3,
      "start_date": "2025-11-03T15:00:00.000Z",
      "end_date": null,
      "created_at": "2025-11-11T04:06:00.719Z",
      "creator_id": "e9b76740-4002-4094-8d84-9f2690cda4a8",
      "author_id": "e9b76740-4002-4094-8d84-9f2690cda4a8",
      "author_username": "이정한",
      "personal_score": 5,
      "joined_by_me": false,
      "participant_count": 1,
      "liked_by_me": false,
      "like_count": 0,
      "post_count": 0,
      "participant_user": [
        {
          "participant_user_id": "e9b76740-4002-4094-8d84-9f2690cda4a8",
          "participant_username": "이정한"
        }
      ],
      "like_user": []
    },
    {
      "challenge_id": "b2b87492-537f-485a-8ffc-8537b72dae16",
      "title": "수학 킬러 문항 집중 분석",
      "content": {
        "tags": ["수학", "킬러문항", "30일챌린지"],
        "description": "30일 동안 매일 킬러/준킬러 문제 2개씩 풀고, 풀이 과정을 완벽하게 정리하기"
      },
      "frequency_type": "daily",
      "target_per_week": null,
      "start_date": "2025-11-04T15:00:00.000Z",
      "end_date": "2025-12-30T15:00:00.000Z",
      "created_at": "2025-11-11T01:33:15.232Z",
      "creator_id": "d038811c-48ce-4a71-93fe-12714c119996",
      "author_id": "d038811c-48ce-4a71-93fe-12714c119996",
      "author_username": "조진세",
      "personal_score": 5,
      "joined_by_me": false,
      "participant_count": 2,
      "liked_by_me": false,
      "like_count": 2,
      "post_count": 0,
      "participant_user": [
        {
          "participant_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "participant_username": "박민성"
        },
        {
          "participant_user_id": "75d12804-2cd6-4d8a-9a1f-b9e6a54878b1",
          "participant_username": "임창정"
        }
      ],
      "like_user": [
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "박민성"
        },
        {
          "like_user_id": "d038811c-48ce-4a71-93fe-12714c119996",
          "like_username": "조진세"
        }
      ]
    },
    {
      "challenge_id": "95d600ef-b05b-4d14-aec0-93d00609e48d",
      "title": "영단어 30개 암기",
      "content": {
        "tags": ["영단어", "암기"],
        "description": "하루 30개 단어를 암기하고 예문 1개씩 작성"
      },
      "frequency_type": "daily",
      "target_per_week": null,
      "start_date": "2025-10-31T15:00:00.000Z",
      "end_date": null,
      "created_at": "2025-11-11T04:06:10.122Z",
      "creator_id": "e9b76740-4002-4094-8d84-9f2690cda4a8",
      "author_id": "e9b76740-4002-4094-8d84-9f2690cda4a8",
      "author_username": "이정한",
      "personal_score": 1,
      "joined_by_me": true,
      "participant_count": 2,
      "liked_by_me": false,
      "like_count": 0,
      "post_count": 1,
      "participant_user": [
        {
          "participant_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "participant_username": "박현"
        },
        {
          "participant_user_id": "e9b76740-4002-4094-8d84-9f2690cda4a8",
          "participant_username": "이정한"
        }
      ],
      "like_user": []
    },
    {
      "challenge_id": "62ee4486-b256-46b4-b013-ccbdbe4f8430",
      "title": "국어 문학 지문 읽기",
      "content": {
        "tags": ["국어", "문학"],
        "description": null
      },
      "frequency_type": "weekly",
      "target_per_week": 2,
      "start_date": "2025-11-09T15:00:00.000Z",
      "end_date": "2025-12-30T15:00:00.000Z",
      "created_at": "2025-11-10T07:17:46.019Z",
      "creator_id": "aa21511c-31e3-4cef-8c7b-f4f2da583634",
      "author_id": "aa21511c-31e3-4cef-8c7b-f4f2da583634",
      "author_username": "김상호",
      "personal_score": 0,
      "joined_by_me": false,
      "participant_count": 5,
      "liked_by_me": false,
      "like_count": 3,
      "post_count": 7,
      "participant_user": [
        {
          "participant_user_id": "aa21511c-31e3-4cef-8c7b-f4f2da583634",
          "participant_username": "김상호"
        },
        {
          "participant_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "participant_username": "박민성"
        },
        {
          "participant_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "participant_username": "임수진"
        },
        {
          "participant_user_id": "156c5591-1d7b-445b-9d7a-1825868dc688",
          "participant_username": "정우주"
        },
        {
          "participant_user_id": "99314b17-5c92-4c49-9c45-4306033a6027",
          "participant_username": "홍길동"
        }
      ],
      "like_user": [
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "박민성"
        },
        {
          "like_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "like_username": "임수진"
        },
        {
          "like_user_id": "99314b17-5c92-4c49-9c45-4306033a6027",
          "like_username": "홍길동"
        }
      ]
    },
    {
      "challenge_id": "c1f7d807-7b63-403f-8935-31b900ce1795",
      "title": "매삼비 풀기",
      "content": {
        "tags": ["국어", "비문학"],
        "description": null
      },
      "frequency_type": "daily",
      "target_per_week": null,
      "start_date": "2025-11-08T15:00:00.000Z",
      "end_date": "2025-12-11T15:00:00.000Z",
      "created_at": "2025-11-10T06:55:05.040Z",
      "creator_id": "75d12804-2cd6-4d8a-9a1f-b9e6a54878b1",
      "author_id": "75d12804-2cd6-4d8a-9a1f-b9e6a54878b1",
      "author_username": "임창정",
      "personal_score": 0,
      "joined_by_me": false,
      "participant_count": 3,
      "liked_by_me": false,
      "like_count": 3,
      "post_count": 3,
      "participant_user": [
        {
          "participant_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "participant_username": "박민성"
        },
        {
          "participant_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "participant_username": "임수진"
        },
        {
          "participant_user_id": "75d12804-2cd6-4d8a-9a1f-b9e6a54878b1",
          "participant_username": "임창정"
        }
      ],
      "like_user": [
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "박민성"
        },
        {
          "like_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "like_username": "임수진"
        },
        {
          "like_user_id": "75d12804-2cd6-4d8a-9a1f-b9e6a54878b1",
          "like_username": "임창정"
        }
      ]
    },
    {
      "challenge_id": "b7424310-a6ff-4d7e-9afb-af6b0520c652",
      "title": "영어 모의고사 듣기평가",
      "content": {
        "tags": ["영어", "듣기"],
        "description": null
      },
      "frequency_type": "daily",
      "target_per_week": null,
      "start_date": "2025-11-09T15:00:00.000Z",
      "end_date": "2025-12-11T15:00:00.000Z",
      "created_at": "2025-11-10T06:33:03.995Z",
      "creator_id": "99314b17-5c92-4c49-9c45-4306033a6027",
      "author_id": "99314b17-5c92-4c49-9c45-4306033a6027",
      "author_username": "홍길동",
      "personal_score": 0,
      "joined_by_me": false,
      "participant_count": 5,
      "liked_by_me": false,
      "like_count": 4,
      "post_count": 6,
      "participant_user": [
        {
          "participant_user_id": "aa21511c-31e3-4cef-8c7b-f4f2da583634",
          "participant_username": "김상호"
        },
        {
          "participant_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "participant_username": "박민성"
        },
        {
          "participant_user_id": "75d12804-2cd6-4d8a-9a1f-b9e6a54878b1",
          "participant_username": "임창정"
        },
        {
          "participant_user_id": "d038811c-48ce-4a71-93fe-12714c119996",
          "participant_username": "조진세"
        },
        {
          "participant_user_id": "99314b17-5c92-4c49-9c45-4306033a6027",
          "participant_username": "홍길동"
        }
      ],
      "like_user": [
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "박민성"
        },
        {
          "like_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "like_username": "임수진"
        },
        {
          "like_user_id": "75d12804-2cd6-4d8a-9a1f-b9e6a54878b1",
          "like_username": "임창정"
        },
        {
          "like_user_id": "d038811c-48ce-4a71-93fe-12714c119996",
          "like_username": "조진세"
        }
      ]
    },
    {
      "challenge_id": "cb841157-33e8-4bdd-a21e-fe66c314d9fc",
      "title": "한국사검정능력시험 1급",
      "content": {
        "tags": ["tag1", "tag2"],
        "description": "한국사 공부"
      },
      "frequency_type": "daily",
      "target_per_week": null,
      "start_date": "2025-10-23T15:00:00.000Z",
      "end_date": null,
      "created_at": "2025-11-10T06:10:18.345Z",
      "creator_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
      "author_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
      "author_username": "박현",
      "personal_score": 0,
      "joined_by_me": false,
      "participant_count": 2,
      "liked_by_me": false,
      "like_count": 3,
      "post_count": 1,
      "participant_user": [
        {
          "participant_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "participant_username": "임수진"
        },
        {
          "participant_user_id": "d038811c-48ce-4a71-93fe-12714c119996",
          "participant_username": "조진세"
        }
      ],
      "like_user": [
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "박민성"
        },
        {
          "like_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "like_username": "임수진"
        },
        {
          "like_user_id": "d038811c-48ce-4a71-93fe-12714c119996",
          "like_username": "조진세"
        }
      ]
    },
    {
      "challenge_id": "4f5d4633-943f-45dd-8d61-4fab2b54a018",
      "title": "독서/비문학 지문 분석",
      "content": null,
      "frequency_type": "weekly",
      "target_per_week": 4,
      "start_date": "2025-10-30T15:00:00.000Z",
      "end_date": "2025-12-30T15:00:00.000Z",
      "created_at": "2025-11-07T06:28:42.806Z",
      "creator_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
      "author_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
      "author_username": "박민성",
      "personal_score": 0,
      "joined_by_me": false,
      "participant_count": 3,
      "liked_by_me": false,
      "like_count": 2,
      "post_count": 2,
      "participant_user": [
        {
          "participant_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "participant_username": "박민성"
        },
        {
          "participant_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "participant_username": "임수진"
        },
        {
          "participant_user_id": "d038811c-48ce-4a71-93fe-12714c119996",
          "participant_username": "조진세"
        }
      ],
      "like_user": [
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "박민성"
        },
        {
          "like_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "like_username": "임수진"
        }
      ]
    },
    {
      "challenge_id": "212a6b88-023d-4d2e-bbc4-3d99634008af",
      "title": "물I 수능특강 전체 복습",
      "content": null,
      "frequency_type": "daily",
      "target_per_week": null,
      "start_date": "2025-10-26T15:00:00.000Z",
      "end_date": "2025-12-30T15:00:00.000Z",
      "created_at": "2025-11-03T06:31:58.667Z",
      "creator_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
      "author_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
      "author_username": "이상",
      "personal_score": 0,
      "joined_by_me": true,
      "participant_count": 4,
      "liked_by_me": false,
      "like_count": 3,
      "post_count": 12,
      "participant_user": [
        {
          "participant_user_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
          "participant_username": "testUser1"
        },
        {
          "participant_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "participant_username": "박민성"
        },
        {
          "participant_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "participant_username": "박현"
        },
        {
          "participant_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "participant_username": "임수진"
        }
      ],
      "like_user": [
        {
          "like_user_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
          "like_username": "testUser1"
        },
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "박민성"
        },
        {
          "like_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "like_username": "임수진"
        }
      ]
    },
    {
      "challenge_id": "6a921da8-04bb-47fa-8e7d-e1dbce5b136d",
      "title": "수능 영어 단어 복습",
      "content": null,
      "frequency_type": "daily",
      "target_per_week": null,
      "start_date": "2025-10-26T15:00:00.000Z",
      "end_date": "2025-12-30T15:00:00.000Z",
      "created_at": "2025-11-03T05:09:33.024Z",
      "creator_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
      "author_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
      "author_username": "이상",
      "personal_score": 0,
      "joined_by_me": true,
      "participant_count": 4,
      "liked_by_me": false,
      "like_count": 2,
      "post_count": 11,
      "participant_user": [
        {
          "participant_user_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
          "participant_username": "testUser1"
        },
        {
          "participant_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "participant_username": "박현"
        },
        {
          "participant_user_id": "e9b76740-4002-4094-8d84-9f2690cda4a8",
          "participant_username": "이정한"
        },
        {
          "participant_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "participant_username": "임수진"
        }
      ],
      "like_user": [
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "박민성"
        },
        {
          "like_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "like_username": "임수진"
        }
      ]
    },
    {
      "challenge_id": "0520beb0-e07b-492e-8be3-ecd6d2b0dccc",
      "title": "수학 파이널 모의고사",
      "content": null,
      "frequency_type": "weekly",
      "target_per_week": 3,
      "start_date": "2025-10-26T15:00:00.000Z",
      "end_date": "2025-12-30T15:00:00.000Z",
      "created_at": "2025-11-03T05:08:07.777Z",
      "creator_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
      "author_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
      "author_username": "박현",
      "personal_score": 0,
      "joined_by_me": true,
      "participant_count": 3,
      "liked_by_me": false,
      "like_count": 2,
      "post_count": 11,
      "participant_user": [
        {
          "participant_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "participant_username": "박민성"
        },
        {
          "participant_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "participant_username": "박현"
        },
        {
          "participant_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "participant_username": "임수진"
        }
      ],
      "like_user": [
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "박민성"
        },
        {
          "like_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "like_username": "임수진"
        }
      ]
    },
    {
      "challenge_id": "f1d5449d-fe9a-4569-b086-f90a532400d9",
      "title": "기하와 벡터",
      "content": null,
      "frequency_type": "daily",
      "target_per_week": null,
      "start_date": "2025-10-28T15:00:00.000Z",
      "end_date": null,
      "created_at": "2025-10-29T02:30:56.207Z",
      "creator_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
      "author_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
      "author_username": "임수진",
      "personal_score": 0,
      "joined_by_me": false,
      "participant_count": 1,
      "liked_by_me": false,
      "like_count": 3,
      "post_count": 3,
      "participant_user": [
        {
          "participant_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "participant_username": "임수진"
        }
      ],
      "like_user": [
        {
          "like_user_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
          "like_username": "testUser1"
        },
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "박민성"
        },
        {
          "like_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "like_username": "임수진"
        }
      ]
    },
    {
      "challenge_id": "433f49ad-e80e-4d60-883c-c747f629f2b7",
      "title": "국어 파이널 모의고사",
      "content": null,
      "frequency_type": "weekly",
      "target_per_week": 3,
      "start_date": "2025-10-27T15:00:00.000Z",
      "end_date": "2025-12-30T15:00:00.000Z",
      "created_at": "2025-10-28T02:06:11.268Z",
      "creator_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
      "author_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
      "author_username": "박현",
      "personal_score": 0,
      "joined_by_me": true,
      "participant_count": 2,
      "liked_by_me": false,
      "like_count": 3,
      "post_count": 7,
      "participant_user": [
        {
          "participant_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "participant_username": "박현"
        },
        {
          "participant_user_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
          "participant_username": "이상"
        }
      ],
      "like_user": [
        {
          "like_user_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
          "like_username": "testUser1"
        },
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "박민성"
        },
        {
          "like_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "like_username": "임수진"
        }
      ]
    },
    {
      "challenge_id": "9cced7c8-ef3b-4ed1-9ec7-379819fb3952",
      "title": "수능특강 수학 1회독",
      "content": null,
      "frequency_type": "daily",
      "target_per_week": null,
      "start_date": "2025-10-23T15:00:00.000Z",
      "end_date": "2025-12-30T15:00:00.000Z",
      "created_at": "2025-10-24T05:40:22.393Z",
      "creator_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
      "author_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
      "author_username": "이상",
      "personal_score": 0,
      "joined_by_me": false,
      "participant_count": 1,
      "liked_by_me": false,
      "like_count": 2,
      "post_count": 3,
      "participant_user": [
        {
          "participant_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "participant_username": "박민성"
        }
      ],
      "like_user": [
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "박민성"
        },
        {
          "like_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "like_username": "임수진"
        }
      ]
    },
    {
      "challenge_id": "2328b4b5-a3b6-498c-81a0-54013a5a8d05",
      "title": "수능특강 영어 1회독",
      "content": null,
      "frequency_type": "weekly",
      "target_per_week": 5,
      "start_date": "2025-10-23T15:00:00.000Z",
      "end_date": "2025-12-30T15:00:00.000Z",
      "created_at": "2025-10-24T05:36:16.106Z",
      "creator_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
      "author_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
      "author_username": "이상",
      "personal_score": 0,
      "joined_by_me": false,
      "participant_count": 1,
      "liked_by_me": true,
      "like_count": 3,
      "post_count": 1,
      "participant_user": [
        {
          "participant_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "participant_username": "박민성"
        }
      ],
      "like_user": [
        {
          "like_user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
          "like_username": "박민성"
        },
        {
          "like_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "like_username": "박현"
        },
        {
          "like_user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
          "like_username": "임수진"
        }
      ]
    }
  ]
}
```
