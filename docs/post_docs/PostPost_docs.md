# 인증글 등록 : `POST /api/challenges/:id/posts`

- `Authorization: Bearer <accessToken>`을 헤더로 보내야 함
- `content`는 JSON 형식으로 작성할 것 => 내부 내용에 따라 여러 확장이 가능

## 성공

- request

```http
{
  "content": {
    "제목": "미적분",
    "학습 목표": ["평균 변화량", "기울기"],
    "학습 내용": "간단한 개념~~~~",
    "오늘 배운 점": "!!!!!",
    "자료": "수능특강 25P~53P or 현우진 *** 1강~3강"
  },
  "user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
  "challenge_id": "433f49ad-e80e-4d60-883c-c747f629f2b7"
}
```

- response
  - `post_count`는 해당 챌린지의 총 인증글 수

```json
{
  "ok": true,
  "message": "인증글이 등록되었습니다.",
  "post": {
    "post_id": "9497680e-37e8-451d-8591-1a8469758a15",
    "content": {
      "자료": "수능특강 25P~53P or 현우진 *** 1강~3강",
      "제목": "미적분",
      "학습 내용": "간단한 개념~~~~",
      "학습 목표": ["평균 변화량", "기울기"],
      "오늘 배운 점": "!!!!!"
    },
    "user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
    "challenge_id": "433f49ad-e80e-4d60-883c-c747f629f2b7",
    "created_at": "2025-10-29T08:03:19.861Z"
  },
  "post_count": 2
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
