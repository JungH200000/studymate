# Login

- request
  - 헤더: Content-Type: application/json

## 성공

- request

```http
{
  "email": "jungjung@naver.com",
  "password": "1234"
}
```

- response

```json
{
  "ok": true,
  "message": "로그인에 성공했습니다.",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiY2U5NzhmNmUtNWZkMC00ZmM1LWE0ZGItMjk0M2M5ZTNjMDkzIiwiZW1haWwiOiJqdW5nanVuZ0BuYXZlci5jb20iLCJpYXQiOjE3NjExODM0ODUsImV4cCI6MTc2MTE4NDM4NX0.zYWEuVGSKsehUqdQl9fA3kfzhXln8KDBBi2vEP-fC_Y",
  "user": {
    "id": "ce978f6e-5fd0-4fc5-a4db-2943c9e3c093",
    "email": "jungjung@naver.com",
    "username": "jungjung1234"
  }
}
```

---

## 실패

### email이나 password 미입력

- request

```http
{
  "email": "jungjung@naver.com",
  "password": ""
}
```

또는

```http
{
  "email": "",
  "password": "1234"
}
```

- response

```json
{
  "ok": false,
  "message": "email이나 password를 입력하지 않았습니다."
}
```

### email, password 오류

- response

```json
{
  "ok": false,
  "message": "Invalid credentials"
}
```
