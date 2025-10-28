# 챌린지 참여 신청(POST)/취소(DELETE)

- `Authorization: Bearer <accessToken>`을 헤더로 보내야 함
- `:id`는 `challenge_id`를 의미함

## `POST /api/challenges/:id/participants`

- `:id`에 `challenge_id`가 들어감

### 성공

- user_id : 챌린지 좋아요한 유저(현재 사용자)
- challenge_id : 좋아요한 챌린지

```json
{
  "ok": true,
  "likeApplyInfo": {
    "user_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
    "challenge_id": "58278248-b977-4cf7-a7b6-21f5bd1c9a16"
  }
}
```

### 실패

- 정확하지 않은 `challenge_id`가 들어갈 경우

```json
{
  "ok": false,
  "code": "22P02",
  "message": "정확하지 않은 challenge_id 입니다."
}
```

## / `DELETE /api/challenges/:id/participants`

- `:id`에 `challenge_id`가 들어감

### 성공

- user_id : 챌린지 좋아요 취소한 유저(현재 사용자)
- challenge_id : 좋아요 취소한 챌린지

```json
{
  "ok": true,
  "user_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
  "challenge_id": "58278248-b977-4cf7-a7b6-21f5bd1c9a16",
  "message": "좋아요가 취소되었습니다."
}
```

### 실패

- 정확하지 않은 `challenge_id`가 들어갈 경우

```json
{
  "ok": false,
  "code": "22P02",
  "message": "정확하지 않은 challenge_id 입니다."
}
```
