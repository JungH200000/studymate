# test

- access token은 15분만 유효

- request

```http
GET .../api/test/profile
Authorization: Bearer <accessToken>
```

- response

```json
{
  "ok": true,
  "message": "test: 인증 성공!!!",
  "user": {
    "id": "ce978f6e-5fd0-4fc5-a4db-2943c9e3c093",
    "email": "jungjung@naver.com"
  }
}
```

## 실패

### Authorization 헤더 미입력

```json
{
  "ok": false,
  "message": "Authorization 헤더가 없습니다."
}
```

### 만료된 token

- response

```json
{
  "ok": false,
  "code": "JWT_EXPIRED",
  "message": "Access Token이 만료되었습니다."
}
```

### 잘못된 token 입력

- response

```json
{
  "ok": false,
  "code": "INVALID_TOKEN",
  "message": "유효하지 않은 토큰입니다."
}
```
