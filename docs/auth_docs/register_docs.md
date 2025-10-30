# Register

- request
  - 헤더: Content-Type: application/json

## 성공

- request

```http
{
  "email": "jungjung@naver.com",
  "password": "1234",
  "username": "jungjung1234"
}
```

- response

```json
{
  "ok": true,
  "message": "✅ Register Success",
  "user": {
    "user_id": "ce978f6e-5fd0-4fc5-a4db-2943c9e3c093",
    "email": "jungjung@naver.com",
    "username": "jungjung1234",
    "created_at": "2025-10-22T01:32:11.669Z"
  }
}
```

---

## 실패

### email, username 중복

- response

```json
{
  "ok": false,
  "message": "이미 사용 중인 email입니다."
}
```

```json
{
  "ok": false,
  "message": "이미 사용 중인 username입니다."
}
```

### 올바르지 않은 email, username, password 형식

- response

```json
{
  "ok": false,
  "message": "잘못된 입력 형식입니다."
}
```

[입력 타당성](../../server/src/utils/auth.validators.js) 참고
