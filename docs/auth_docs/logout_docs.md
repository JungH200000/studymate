# Logout

- 쿠키 자동 전송됨

## 성공

- request

```http
POST .../api/auth/logout
```

- response

```json
{
  "ok": true,
  "message": "로그아웃 되었습니다."
}
```

- db에 revoked_at이 업데이트 됨
