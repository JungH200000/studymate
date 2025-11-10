# 응원 클릭(POST) / 취소(DELETE)

- `Authorization: Bearer <accessToken>`을 헤더로 보내야 함
- `:id`는 `post_id`를 의미함

## 클릭 `POST /api/posts/:id/cheers`

### 성공

- "user_id" : 인증글에 응원 클릭한 유저
- "post_id" : 응원한 인증글

```json
{
  "ok": false,
  "user_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
  "post_id": "42cf3c1b-87dd-4143-b704-20a3a19c23b5",
  "cheer_by_me": true,
  "cheer_count": 1,
  "created": false
}
```

- 중복 응원일 경우 : `"created": false`

```json
{
  "ok": false,
  "user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
  "post_id": "42cf3c1b-87dd-4143-b704-20a3a19c23b5",
  "cheer_by_me": true,
  "cheer_count": 2,
  "created": false
}
```

### 실패

- 정확하지 않은 post_id 들어갈 경우

```json
{
  "ok": false,
  "code": "FOREIGN_KEY_NOT_FOUND",
  "message": "대상 리소스를 찾을 수 없습니다."
}
```

## 취소 `DELETE /api/posts/:id/cheers`

### 성공

```json
{
  "ok": true,
  "user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
  "post_id": "42cf3c1b-87dd-4143-b704-20a3a19c23b5",
  "cheer_by_me": false,
  "cheer_count": 1,
  "created": true,
  "message": "응원이 취소되었습니다."
}
```

- 중복 응원일 경우 : `"created": false`

```json
{
  "ok": true,
  "user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
  "post_id": "42cf3c1b-87dd-4143-b704-20a3a19c23b5",
  "cheer_by_me": false,
  "cheer_count": 1,
  "created": false,
  "message": "응원이 취소되었습니다."
}
```

### 실패

- 정확하지 않은 post_id 들어갈 경우

```json
{
  "ok": false,
  "code": "FOREIGN_KEY_NOT_FOUND",
  "message": "대상 리소스를 찾을 수 없습니다."
}
```
