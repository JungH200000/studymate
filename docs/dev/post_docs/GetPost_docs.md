# 인증글 가져오기 : `GET /api/challenges/:id/posts`

- `Authorization: Bearer <accessToken>`을 헤더로 보내야 함

## 성공

- response
  - "cheer_by_me": 사용자가 응원을 눌렀는지 여부
    - 응원을 누르지 않았다면 false 반환
  - "cheer_count": 해당 인증글의 응원 수
    - 없으면 0 반환
  - "cheer_user": 해당 인증글에 응원을 누른 유저 목록
    - 없으면 [](빈 배열) 반환

```json
{
  "ok": true,
  "user_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
  "pageNum": 1,
  "limitNum": 20,
  "offset": 0,
  "totalPostsList": [
    {
      "post_id": "42cf3c1b-87dd-4143-b704-20a3a19c23b5",
      "content": {
        "goal": "화이팅",
        "title": "수능",
        "summary": "하세요",
        "reference": "수능특강",
        "reflection": "재밌음"
      },
      "user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
      "challenge_id": "433f49ad-e80e-4d60-883c-c747f629f2b7",
      "created_at": "2025-10-30T01:52:57.974Z",
      "posted_date_kst": "2025-10-29T15:00:00.000Z",
      "username": "지훈",
      "cheer_by_me": false,
      "cheer_count": 0,
      "cheer_user": []
    },
    {
      "post_id": "0361e7c5-6716-4f42-b3ee-d9f77bc80c01",
      "content": {
        "tags": ["tag1", "tag2"],
        "goals": ["학습 목표1", "학습 목표2", "..."],
        "title": "제목",
        "summary": "학습 요약",
        "materials": {
          "links": [],
          "lecture": {
            "series": "강의 이름",
            "teacher": "강사 이름",
            "lessonEnd": 3,
            "lessonStart": 1
          },
          "textbook": {
            "name": "문제집 이름",
            "pageEnd": 45,
            "pageStart": 25
          }
        },
        "nextSteps": ["다음 학습 목표"],
        "takeaways": "오늘 배운 점/느낀 점",
        "studyMinutes": 100,
        "studyDurationText": "1시간 40분"
      },
      "user_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
      "challenge_id": "433f49ad-e80e-4d60-883c-c747f629f2b7",
      "created_at": "2025-10-30T01:13:43.217Z",
      "posted_date_kst": "2025-10-29T15:00:00.000Z",
      "username": "1234",
      "cheer_by_me": true,
      "cheer_count": 1,
      "cheer_user": [
        {
          "cheer_user_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
          "cheer_username": "1234"
        }
      ]
    },
    {
      "post_id": "f8063022-4e68-40a8-b3d2-74e452d90099",
      "content": {
        "tags": ["tag1", "tag2"],
        "goals": ["학습 목표1", "학습 목표2", "..."],
        "title": "제목",
        "summary": "학습 요약",
        "materials": {
          "links": [],
          "lecture": {
            "series": "강의 이름",
            "teacher": "강사 이름",
            "lessonEnd": 3,
            "lessonStart": 1
          },
          "textbook": {
            "name": "문제집 이름",
            "pageEnd": 45,
            "pageStart": 25
          }
        },
        "nextSteps": ["다음 학습 목표"],
        "takeaways": "오늘 배운 점/느낀 점",
        "studyMinutes": 100,
        "studyDurationText": "1시간 40분"
      },
      "user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
      "challenge_id": "433f49ad-e80e-4d60-883c-c747f629f2b7",
      "created_at": "2025-10-30T00:59:20.007Z",
      "posted_date_kst": "2025-10-29T15:00:00.000Z",
      "username": "park",
      "cheer_by_me": false,
      "cheer_count": 1,
      "cheer_user": [
        {
          "cheer_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "cheer_username": "park"
        }
      ]
    },
    {
      "post_id": "e20c3b70-3986-4550-9631-989192848095",
      "content": {
        "자료": "수능특강 25P~53P or 현우진 *** 1강~3강",
        "제목": "미적분",
        "학습 내용": "간단한 개념~~~~",
        "학습 목표": ["평균 변화량", "기울기"],
        "오늘 배운 점": "!!!!!"
      },
      "user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
      "challenge_id": "433f49ad-e80e-4d60-883c-c747f629f2b7",
      "created_at": "2025-10-29T08:05:08.300Z",
      "posted_date_kst": "2025-10-28T15:00:00.000Z",
      "username": "park",
      "cheer_by_me": false,
      "cheer_count": 0,
      "cheer_user": []
    },
    {
      "post_id": "50a57586-edf4-4848-af1b-21f98885502a",
      "content": {
        "자료": "수능특강 25P~53P or 현우진 *** 1강~3강",
        "제목": "미적분",
        "학습 내용": "간단한 개념~~~~",
        "학습 목표": ["평균 변화량", "기울기"],
        "오늘 배운 점": "!!!!!"
      },
      "user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
      "challenge_id": "433f49ad-e80e-4d60-883c-c747f629f2b7",
      "created_at": "2025-10-28T07:46:15.786Z",
      "posted_date_kst": "2025-10-27T15:00:00.000Z",
      "username": "park",
      "cheer_by_me": true,
      "cheer_count": 2,
      "cheer_user": [
        {
          "cheer_user_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
          "cheer_username": "1234"
        },
        {
          "cheer_user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
          "cheer_username": "park"
        }
      ]
    }
  ]
}
```
