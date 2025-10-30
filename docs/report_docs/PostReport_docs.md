# 부적절한 챌린지/인증글 신고

- `Authorization: Bearer <accessToken>`을 헤더로 보내야 함

## 부적절한 챌린지글 신고 : `POST /api/reports/challenges/:id`

- id는 challenge_id

### 성공

- request

```http
{
    "content": "너 신고!!"
}
```

- response

```json
{
  "ok": true,
  "message": "신고되었습니다.",
  "report": {
    "report_id": "d80925ce-8106-480f-89cd-c71d9fc8eb36",
    "created_at": "2025-10-30T06:19:32.774Z"
  }
}
```

### 실패

#### 중복 신고할 경우

- response

```json
{
  "ok": false,
  "code": "ERR_ALREADY_REPORTED",
  "message": "이미 신고한 챌린지입니다."
}
```

#### 글자 수 5자 미만이거나 500자 초과

```json
{
  "ok": false,
  "code": "INVALID_REPORT_INPUT",
  "message": "신고 사유는 5~500자여야 합니다."
}
```

## 부적절한 인증글 신고 : `POST /api/reports/posts/:id`

- id는 post_id

### 성공

- request

```http
{
    "content": "너 신고!!"
}
```

- response

```json
{
  "ok": true,
  "message": "신고되었습니다.",
  "report": {
    "report_id": "27796e36-a021-43e7-a325-6482c87b8ee7",
    "created_at": "2025-10-30T06:34:41.073Z"
  }
}
```

### 실패

#### 중복 신고할 경우

- response

```json
{
  "ok": false,
  "code": "ERR_ALREADY_REPORTED",
  "message": "이미 신고한 인증글입니다."
}
```

#### 글자 수 5자 미만이거나 500자 초과

```json
{
  "ok": false,
  "code": "INVALID_REPORT_INPUT",
  "message": "신고 사유는 5~500자여야 합니다."
}
```
