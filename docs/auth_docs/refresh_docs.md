# Refresh

- accessToken은 15분 유효, refreshToken은 7일 유효
- 프론트에서 accessToken 만료 시(401 감지) -> `/api/auth/refresh` 호출
- 쿠키는 자동 전송됨

- request
  - 헤더: X

## 성공

```http
POST .../api/auth/refresh
Cookie: refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjZTk3OGY2ZS01ZmQwLTRmYzUtYTRkYi0yOTQzYzllM2MwOTMiLCJqdGkiOiJiOTJjZDVlYy1mM2FiLTRmYzktYjIwNi1iMGM2OGExMjM4NWQiLCJpYXQiOjE3NjExOTQyOTksImV4cCI6MTc2MTc5OTA5OX0.eVPj0d6rGnVOhETD2r2RM30ZGYc-F-DVZE_IjhsRK5c
```

```json
{
  "ok": true,
  "message": "토큰이 재발급 되었습니다.",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjZTk3OGY2ZS01ZmQwLTRmYzUtYTRkYi0yOTQzYzllM2MwOTMiLCJlbWFpbCI6Imp1bmdqdW5nQG5hdmVyLmNvbSIsImlhdCI6MTc2MTE5NDU5OSwiZXhwIjoxNzYxMTk1NDk5fQ.zi7dte7Lep668llbEJFP-MhTZwZgM9JSAQEiFQubbIE",
  "user": {
    "id": "ce978f6e-5fd0-4fc5-a4db-2943c9e3c093",
    "email": "jungjung@naver.com",
    "username": "jungjung1234"
  }
}
```

- 이전 refresh token의 revoked_at이 업데이트됨

## 실패

### 없는 refresh token 입력 시

- response

```json
{
  "ok": false,
  "message": "세션을 찾을 수 없습니다."
}
```

### 이미 revoked된 refresh token 입력 시

- request

```http
POST .../api/auth/refresh
Cookie: refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjZTk3OGY2ZS01ZmQwLTRmYzUtYTRkYi0yOTQzYzllM2MwOTMiLCJqdGkiOiJiOTJjZDVlYy1mM2FiLTRmYzktYjIwNi1iMGM2OGExMjM4NWQiLCJpYXQiOjE3NjExOTQyOTksImV4cCI6MTc2MTc5OTA5OX0.eVPj0d6rGnVOhETD2r2RM30ZGYc-F-DVZE_IjhsRK5c
```

- response

```json
{
  "ok": false,
  "message": "이미 만료된 세션입니다."
}
```
