# `GET /api/challenges/rankings`

- - `Authorization: Bearer <accessToken>`을 헤더로 보내야 함
- 옵션: 페이지네이션 `?page=1&limit=50`

- API 요청할 때 이전과 변동 사항이 있었다면 `delta` 값이 +/- 값으로 출력됨 그리고 다시 한 번 더 API 요청을 하면 변동 사항이 없어짐

  - 등급 상승 시에는 + 붙지 않음 / 등급 하락 시 -가 붙음 => 프론트에서 + 붙이기
  - ex) 첫 번째 요청 : `"delta" : 2` -> 두 번째 요청 : `"delta" : 0`

- `achieved_30d` : 인증한 횟수
- `expected_30d` : 목표 인증 횟수
- `rate` : 달성률
- `ranking` : 순위
- `delta` : 변동폭

## 성공

### 변동 전

```json
{
  "ok": true,
  "page": "1",
  "limit": "50",
  "count": 6,
  "entries": [
    {
      "user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
      "username": "park",
      "achieved_30d": "16",
      "expected_30d": "52",
      "rate": "0.308",
      "ranking": 1,
      "delta": 0
    },
    {
      "user_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
      "username": "testUser1",
      "achieved_30d": "5",
      "expected_30d": "23",
      "rate": "0.217",
      "ranking": 2,
      "delta": 0
    },
    {
      "user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
      "username": "지훈",
      "achieved_30d": "10",
      "expected_30d": "49",
      "rate": "0.204",
      "ranking": 3,
      "delta": 0
    },
    {
      "user_id": "e9b76740-4002-4094-8d84-9f2690cda4a8",
      "username": "jung",
      "achieved_30d": "0",
      "expected_30d": "1",
      "rate": "0.000",
      "ranking": 4,
      "delta": 0
    },
    {
      "user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
      "username": "sw",
      "achieved_30d": "0",
      "expected_30d": "15",
      "rate": "0.000",
      "ranking": 5,
      "delta": 0
    },
    {
      "user_id": "d038811c-48ce-4a71-93fe-12714c119996",
      "username": "한진환",
      "achieved_30d": "0",
      "expected_30d": "3",
      "rate": "0.000",
      "ranking": 6,
      "delta": 0
    }
  ]
}
```

### 변동 후

```json
{
  "ok": true,
  "page": "1",
  "limit": "50",
  "count": 6,
  "entries": [
    {
      "user_id": "af1f4830-8e7a-48a9-90f3-66227cf40c2a",
      "username": "park",
      "achieved_30d": "19",
      "expected_30d": "54",
      "rate": "0.352",
      "ranking": 1,
      "delta": 0
    },
    {
      "user_id": "d038811c-48ce-4a71-93fe-12714c119996",
      "username": "한진환",
      "achieved_30d": "1",
      "expected_30d": "3",
      "rate": "0.333",
      "ranking": 2,
      "delta": 4
    },
    {
      "user_id": "192c8f1f-cb13-4fb4-8bb5-76fc32625d99",
      "username": "testUser1",
      "achieved_30d": "6",
      "expected_30d": "24",
      "rate": "0.250",
      "ranking": 3,
      "delta": -1
    },
    {
      "user_id": "138ad92c-01c1-432e-b3f2-ef909207218c",
      "username": "지훈",
      "achieved_30d": "11",
      "expected_30d": "50",
      "rate": "0.220",
      "ranking": 4,
      "delta": -1
    },
    {
      "user_id": "e9b76740-4002-4094-8d84-9f2690cda4a8",
      "username": "jung",
      "achieved_30d": "0",
      "expected_30d": "1",
      "rate": "0.000",
      "ranking": 5,
      "delta": -1
    },
    {
      "user_id": "0aca5b9b-4c40-448c-a228-bb87c05c7439",
      "username": "sw",
      "achieved_30d": "0",
      "expected_30d": "15",
      "rate": "0.000",
      "ranking": 6,
      "delta": -1
    }
  ]
}
```
