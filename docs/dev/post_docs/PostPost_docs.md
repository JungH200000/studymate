# 인증글 등록 : `POST /api/challenges/:id/posts`

- `Authorization: Bearer <accessToken>`을 헤더로 보내야 함
- `content`는 JSON 형식으로 작성할 것 => 내부 내용에 따라 여러 확장이 가능
- 프론트엔드: 사용자가 학습 시간 작성([1]시간 [40]분) -> `studyDurationText`에 보관 -> `studyMinutes`로 포맷해서 보여줌
  - `studyMinutes`: 정수로 1시간 40분이면 100, 2시간이면 120으로 변환해서 저장
- request를 보낼 때 빈 값이 있는 경우(property가 없는 경우)가 있다면 생략해서 보내기(request2 참고)

## 성공

### request1

```http
{
  "content": {
    "title": "제목",
    "goals": ["학습 목표1", "학습 목표2", "..."],
    "summary": "학습 요약",
    "takeaways": "오늘 배운 점/느낀 점",
    "materials": {
        "textbook": {"name": "문제집 이름", "pageStart": 25, "pageEnd": 45},
        "lecture": {"teacher": "강사 이름", "series": "강의 이름", "lessonStart": 1, "lessonEnd": 3},
        "links": []
    },
    "studyMinutes": 100,
    "studyDurationText": "1시간 40분",
    "nextSteps": ["다음 학습 목표"],
    "tags": ["tag1", "tag2"]
  }
}
```

### response

- "post_count" : 해당 챌린지의 총 인증글 수
- "myPostCount" : 해당 챌린지에서 사용자가 작성한 인증글 수
- "myWeekPostCount": 해당 챌린지에서 일주일동안 사용자가 작성한 인증글 수
- "getWeeklyTarget": 해당 챌린지의 target_per_week(daily일 경우 7)

#### 챌린지의 frequency_type이 daily일 경우

```json
{
  "ok": true,
  "message": "인증글이 등록되었습니다.",
  "post": {
    "post_id": "0b1812dc-be7d-4219-aadf-a64d448b7417",
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
    "challenge_id": "106a5e7c-2199-458d-bb19-ae3bd117bbfd",
    "created_at": "2025-10-30T12:07:55.466Z"
  },
  "post_count": 4,
  "myPostCount": 4,
  "myWeekPostCount": 2,
  "getWeeklyTarget": 7
}
```

#### 챌린지의 frequency_type이 weekly일 경우

```json
{
  "ok": true,
  "message": "인증글이 등록되었습니다.",
  "post": {
    "post_id": "8d7d0d96-bdcc-4341-994b-00e1f162f876",
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
    "created_at": "2025-10-30T12:11:35.104Z"
  },
  "post_count": 7,
  "myPostCount": 4,
  "myWeekPostCount": 3,
  "getWeeklyTarget": 3
}
```

### request2

- request를 보낼 때 아래 property가 없는 경우가 있다면 생략해서 보내기

```http
 {
 "content": {
   "title": "제목",
   "goals": ["학습 목표1", "학습 목표2", "..."],
   "summary": "학습 요약",
   "takeaways": "오늘 배운 점/느낀 점",
   "materials": {
       "textbook": {"name": "문제집 이름", "pageStart": 25, "pageEnd": 45},
   },
   "studyMinutes": 100,
   "studyDurationText": "1시간 40분",
 }
 }
```

## 실패

### 잘못된 challenge_id

- response

```json
{
  "ok": false,
  "code": "CHALLENGE_NOT_FOUND",
  "message": "챌린지를 찾을 수 없습니다."
}
```

### content 비어있거나 null

- request

```json
{
  "content": null,
  "user_id": "4b8388bf-281a-4a3f-a5e8-1e4cdb5cc827",
  "challenge_id": "433f49ad-e80e-4d60-883c-c747f629f2b7"
}
```

또는

```json
{
  "content": {},
  "user_id": "4b8388bf-281a-4a3f-a5e8-1e4cdb5cc827",
  "challenge_id": "433f49ad-e80e-4d60-883c-c747f629f2b7"
}
```

-response

```json
{
  "ok": false,
  "code": "INVALID_POST_INPUT",
  "message": "content가 비어있습니다."
}
```

### 참여 신청하지 않은 챌린지에 인증글을 등록할 경우

- response

```json
{
  "ok": false,
  "code": "NOT_PARTICIPATION",
  "message": "해당 챌린지에 참여하지 않았습니다."
}
```

### 하루에 동일한 챌린지에서 중복으로 인증글을 등록하려고 할 경우

- response

```json
{
  "ok": false,
  "code": "ERR_ALREADY_POSTED_TODAY",
  "message": "해당 챌린지에 이미 인증글을 작성하셨습니다."
}
```
