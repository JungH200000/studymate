# 챌린지 참여 신청(POST)/취소(DELETE)

- `Authorization: Bearer <accessToken>`을 헤더로 보내야 함
- `:id`는 `challenge_id`를 의미함

## `POST /api/challenges/:id/participants`

- `:id`에 `challenge_id`가 들어감

### 성공

- user_id : 참여 신청한 유저(현재 사용자)
- challenge_id : 참여 신청한 챌린지

```json
{
  "ok": true,
  "participationApplyInfo": {
    "user_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
    "challenge_id": "2c657b10-c5c9-4dd9-82e0-f3e9ae8c28d5"
  }
}
```

## / `DELETE /api/challenges/:id/participants`

- `:id`에 `challenge_id`가 들어감

### 성공

- user_id : 챌린지 참여 취소한 유저(현재 사용자)
- challenge_id : 참여 취소한 챌린지

```json
{
  "ok": true,
  "user_id": "9c2b7aaf-3b3d-426c-a8d6-efe1f3dca7e0",
  "challenge_id": "2c657b10-c5c9-4dd9-82e0-f3e9ae8c28d5",
  "message": "챌린지 참여 취소되었습니다."
}
```
