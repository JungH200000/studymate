# 챌린지 등록

- `Authorization: Bearer <accessToken>`을 헤더로 보내야 함
- `content나 `target_per_week`나 `end_date`를 설정하지 않을 시 `null`을 보내도록 설정하기

## 성공

### content 및 daily, end_date 설정 안 했을 때

- request

```http
{
    "title": "한국사검정능력시험 1급",
    "content": {
      "description": "한국사 공부",
      "tags": ["tag1", "tag2"]
    },
    "frequency_type": "daily",
    "target_per_week": null,
    "start_date": "2025-10-24",
    "end_date": null
}
```

- response

```json
{
  "ok": true,
  "message": "challenge가 생성되었습니다.",
  "challenge": {
    "challenge_id": "cb841157-33e8-4bdd-a21e-fe66c314d9fc",
    "title": "한국사검정능력시험 1급",
    "content": {
      "tags": ["tag1", "tag2"],
      "description": "한국사 공부"
    },
    "frequency_type": "daily",
    "target_per_week": null,
    "start_date": "2025-10-24",
    "end_date": null,
    "created_at": "2025-11-10T06:10:18.345Z",
    "creator_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a"
  }
}
```

### weekly 및 end_date 설정

- request

```http
{
    "title": "한국사검정능력시험 1급",
    "content": {
      "description": "한국사 공부",
      "tags": ["tag1", "tag2"]
    },
    "frequency_type": "weekly",
    "target_per_week": 5,
    "start_date": "2025-10-24",
    "end_date": "2025-12-21"
}
```

- response

```json
{
  "ok": true,
  "message": "challenge가 생성되었습니다.",
  "challenge": {
    "challenge_id": "45d733a0-82b0-4703-b5d6-b2404c81eddc",
    "title": "한국사검정능력시험 1급",
    "content": {
      "tags": ["tag1", "tag2"],
      "description": "한국사 공부"
    },
    "frequency_type": "weekly",
    "target_per_week": 5,
    "start_date": "2025-10-24",
    "end_date": "2025-12-21",
    "created_at": "2025-10-24T02:21:52.068Z",
    "creator_id": "b325aaf3-10d2-44b7-9f3a-75c41ec8174d"
  }
}
```

## 실패

### accessToken 만료

- response

```json
{
  "ok": false,
  "code": "JWT_EXPIRED",
  "message": "Access Token이 만료되었습니다."
}
```

### 유효하지 않은 accessToken

- response

```json
{
  "ok": false,
  "code": "INVALID_TOKEN",
  "message": "유효하지 않은 토큰입니다."
}
```

### 그 외

```json
{
    "ok": false,
    "code": "INVALID_FREQUENCY",
    "message": "daily 또는 weekly만 허용됩니다."
}

{
    "ok": false,
    "code": "INVALID_FREQUENCY_COMBINATION",
    "message": "daily일 경우 target_per_week는 지정할 수 없습니다."
}

{
    "ok": false,
    "code": "INVALID_FREQUENCY_COMBINATION",
    "message": "weekly에는 target_per_week가 필요합니다."
}

{
    "ok": false,
    "code": "INVALID_TARGET_PER_WEEK",
    "message": "target_per_week는 1~7 사이의 정수이어야 합니다."
}
```

## 예시 body

```json
{
  "title": "배고파배고파",
  "content": "밥줘밥줘밥줘",
  "frequency_type": "daily",
  "target_per_week": null,
  "start_date": "2025-10-24",
  "end_date": null
}

{
  "title": "경제 뉴스레터 읽기",
  "content": "매일매일 읽읍시다.",
  "frequency_type": "daily",
  "target_per_week": null,
  "start_date": "2025-10-24",
  "end_date": null
}

{
  "title": "운전면허시험 1급",
  "content": "너무 비싼데",
  "frequency_type": "weekly",
  "target_per_week": 3,
  "start_date": "2025-10-24",
  "end_date": "2025-12-25"
}

{
  "title": "경제 뉴스레터 읽기",
  "content": "꾸준히!",
  "frequency_type": "weekly",
  "target_per_week": 4,
  "start_date": "2025-10-24",
  "end_date": null
}


```
