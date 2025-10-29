# 챌린지 참여 신청(POST)/취소(DELETE)

- `Authorization: Bearer <accessToken>`을 헤더로 보내야 함
- `:id`는 `challenge_id`를 의미함

## 신청: `POST /api/challenges/:id/participants`

- `:id`에 `challenge_id`가 들어감

### 성공

- user_id : 참여 신청한 유저(현재 사용자)
- challenge_id : 참여 신청한 챌린지

```json
{
  "ok": true,
  "user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
  "challenge_id": "2c657b10-c5c9-4dd9-82e0-f3e9ae8c28d5",
  "joined_by_me": true,
  "participant_count": "2",
  "created": true
}
```

- 중복 참여일 경우 : `"created": false`

```json
{
  "ok": true,
  "user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
  "challenge_id": "2c657b10-c5c9-4dd9-82e0-f3e9ae8c28d5",
  "joined_by_me": true,
  "participant_count": "2",
  "created": false
```

### 실패

- 제대로된 challenge_id가 입력되지 않는다면

```json
{
  "ok": false,
  "code": "22P02",
  "message": "정확하지 않은 challenge_id 입니다."
}
```

## 취소: / `DELETE /api/challenges/:id/participants`

- `:id`에 `challenge_id`가 들어감

### 성공

- user_id : 챌린지 참여 취소한 유저(현재 사용자)
- challenge_id : 참여 취소한 챌린지

```json
{
  "ok": true,
  "user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
  "challenge_id": "2c657b10-c5c9-4dd9-82e0-f3e9ae8c28d5",
  "joined_by_me": false,
  "participant_count": "1",
  "deleted": true,
  "message": "챌린지 참여 취소되었습니다."
}
```

- 중복 취소일 경우 : `"deleted": false`

```json
{
  "ok": true,
  "user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
  "challenge_id": "2c657b10-c5c9-4dd9-82e0-f3e9ae8c28d5",
  "joined_by_me": false,
  "participant_count": "1",
  "deleted": false,
  "message": "챌린지 참여 취소되었습니다."
}
```

### 실패

- 제대로된 challenge_id가 입력되지 않는다면

```json
{
  "ok": false,
  "code": "22P02",
  "message": "정확하지 않은 challenge_id 입니다."
}
```
