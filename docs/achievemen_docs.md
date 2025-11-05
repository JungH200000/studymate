# 달성률

- 항상 KST 기준 => `posts` table의 `posted_date_kst` column 이용
- 분모 시작 시점: 챌린지 시작일이 아닌 사용자의 참여일부터 계산 => `participation` table의 `join_at` column 이용 => 그래야 중도 합류자에게 공정함
- 종료일: 챌린지가 진행 중이면 KST 기준으로 오늘까지, `end_date`가 있으면 그 전까지 집계

## 주간 달성률(이번주) : `GET /api/challenges/:id/progress/week`

- 기간: KST기준 월요일부터 일요일까지
- 분모:
  - `daily` = 7
  - `weekly` = `challenges` table의 `target_per_week` column 이용
  - 단, **챌린지가 주중에 종료하게 되면 부분 주가 생김 -> 실제 인증 가능 구간으로 자르고 실제 인증 가능 일수에 맞게 설정**
- 분자: 이번주 사용자가 해당 챌린지에 올린 인증글 수(`posted_date_kst`를 `count`하기)

- 모든 챌린지

  - `weeklySoFarAchieved` : ∑ achieved_sofar_capped : 오늘까지 작성한 총 인증글 수
  - `weeklySoFarTarget` : ∑ weekly_target_sofar : 오늘까지 총 목표 인증글 수
  - `weeklySoFarRate` : weeklySoFarAchieved / weeklySoFarTarget : 오늘까지 주간 달성률
  - `weeklyFullAchieved` : ∑ achieved_full_capped : 이번 주에 작성한 총 인증글 수
  - `weeklyFullTarget` : ∑ weekly_target_full : 이번 주 총 목표 인증글 수
  - `weeklyFullRate` : weeklyFullAchieved / weeklyFullTarget : 이번 주 주간 달성률

- 개별 챌린지

  - `achieved_sofar` : 오늘까지 수행한 인증글 수
  - `achieved_sofar_capped` : `LEAST(achieved_sofar, weekly_target_sofar)`
  - `weekly_target_sofar`: 오늘까지 수행해야 하는 총 인증글 수
  - `rate_sofar` : 오늘까지 주간 달성률(`achieved_sofar_capped / weekly_target_sofar`)
  - `achieved_full_capped` : `LEAST(achieved_sofar, weekly_target_full)`
  - `weekly_target_full` : 이번 주까지 수행해야 하는 총 인증글 수
  - `rate_fullweek` : 이번 주 총 주간 달성률(`achieved_full_capped / weekly_target_full`)
  - `remaining_to_100` : 주 전체 기준(이번 주 끝까지) 남은 인증 횟수
    - A 챌린지가 daily이고 2번 완료했다면 `remaining_to_100 = 5`
    - B 챌린지가 weekly이고 target_per_week가 3이며 1번 완료했다면 `remaining_to_100= 2`
  - `remaining_days` : 주 전체 기준(이번 주 끝까지) 남은 일 수
    - 만약 챌린지가 목요일에 끝난다면 월요일 기준 `remaining_days = 4`
    - 챌린지가 이번 주에 끝나지 않는다면 `remaining_days = 7`

```json
{
  "ok": true,
  "today": {
    "weeklySoFarAchieved": 7,
    "weeklySoFarTarget": 10,
    "weeklySoFarRate": 0.7
  },
  "weekly": {
    "weeklyFullAchieved": 8,
    "weeklyFullTarget": 29,
    "weeklyFullRate": 0.276
  },
  "achievedChallengesList": [
    {
      "challenge_id": "0520beb0-e07b-492e-8be3-ecd6d2b0dccc",
      "title": "수학 파이널 모의고사",
      "achieved_sofar": 2,
      "achieved_sofar_capped": 1,
      "weekly_target_sofar": 1,
      "rate_sofar": "1.000",
      "achieved_full_capped": 2,
      "weekly_target_full": 3,
      "rate_fullweek": "0.667",
      "remaining_to_100": 1,
      "remaining_days": 3
    },
    {
      "challenge_id": "106a5e7c-2199-458d-bb19-ae3bd117bbfd",
      "title": "경제 뉴스레터 읽기",
      "achieved_sofar": 1,
      "achieved_sofar_capped": 1,
      "weekly_target_sofar": 2,
      "rate_sofar": "0.500",
      "achieved_full_capped": 1,
      "weekly_target_full": 7,
      "rate_fullweek": "0.143",
      "remaining_to_100": 6,
      "remaining_days": 5
    },
    {
      "challenge_id": "212a6b88-023d-4d2e-bbc4-3d99634008af",
      "title": "물I 수능특강 전체 복습",
      "achieved_sofar": 2,
      "achieved_sofar_capped": 2,
      "weekly_target_sofar": 2,
      "rate_sofar": "1.000",
      "achieved_full_capped": 2,
      "weekly_target_full": 7,
      "rate_fullweek": "0.286",
      "remaining_to_100": 5,
      "remaining_days": 5
    },
    {
      "challenge_id": "2c657b10-c5c9-4dd9-82e0-f3e9ae8c28d5",
      "title": "독서",
      "achieved_sofar": null,
      "achieved_sofar_capped": 0,
      "weekly_target_sofar": 1,
      "rate_sofar": "0.000",
      "achieved_full_capped": 0,
      "weekly_target_full": 1,
      "rate_fullweek": "0.000",
      "remaining_to_100": 1,
      "remaining_days": 5
    },
    {
      "challenge_id": "433f49ad-e80e-4d60-883c-c747f629f2b7",
      "title": "국어 파이널 모의고사",
      "achieved_sofar": 1,
      "achieved_sofar_capped": 1,
      "weekly_target_sofar": 1,
      "rate_sofar": "1.000",
      "achieved_full_capped": 1,
      "weekly_target_full": 3,
      "rate_fullweek": "0.333",
      "remaining_to_100": 2,
      "remaining_days": 5
    },
    {
      "challenge_id": "6a921da8-04bb-47fa-8e7d-e1dbce5b136d",
      "title": "수능 영어 단어 복습",
      "achieved_sofar": 2,
      "achieved_sofar_capped": 2,
      "weekly_target_sofar": 2,
      "rate_sofar": "1.000",
      "achieved_full_capped": 2,
      "weekly_target_full": 5,
      "rate_fullweek": "0.400",
      "remaining_to_100": 3,
      "remaining_days": 3
    },
    {
      "challenge_id": "fe898210-f4c7-45e8-a836-632a620c66b5",
      "title": "백준 알고리즘 1문제",
      "achieved_sofar": null,
      "achieved_sofar_capped": 0,
      "weekly_target_sofar": 1,
      "rate_sofar": "0.000",
      "achieved_full_capped": 0,
      "weekly_target_full": 3,
      "rate_fullweek": "0.000",
      "remaining_to_100": 3,
      "remaining_days": 3
    }
  ]
}
```

## 전체 달성률 (누적) : `GET /api/challenges/:id/progress/total`

- **저번 주**까지 누적 달성률 출력

- 모든 챌린지

  - `totalAchieved` : 저번 주까지 작성한 총 인증글 수
  - `totalTarget` : 저번 주까지 총 목표 인증글 수
  - `totalRate` : 저번 주까지 전체 달성률

- 개별 챌린지

  - `achieved` : 오늘까지 수행한 인증글 수
  - `achieved_capped` : `LEAST(achieved, challenge_target_day)`
  - `challenge_target_day`: 저번 주까지 총 목표 인증글 수
  - `total_rate` : 저번 주까지 총 달성률
  - `remaining_to_100` : 남은 인증 횟수

```json
{
  "ok": true,
  "total": {
    "totalAchieved": 7,
    "totalTarget": 26,
    "totalRate": 0.269
  },
  "achievedChallengesList": [
    {
      "challenge_id": "106a5e7c-2199-458d-bb19-ae3bd117bbfd",
      "title": "경제 뉴스레터 읽기",
      "achieved": 4,
      "achieved_capped": 4,
      "challenge_target_day": 9,
      "total_rate": "0.444",
      "remaining_to_100": 5
    },
    {
      "challenge_id": "2c657b10-c5c9-4dd9-82e0-f3e9ae8c28d5",
      "title": "독서",
      "achieved": 0,
      "achieved_capped": 0,
      "challenge_target_day": 9,
      "total_rate": "0.000",
      "remaining_to_100": 9
    },
    {
      "challenge_id": "433f49ad-e80e-4d60-883c-c747f629f2b7",
      "title": "국어 파이널 모의고사",
      "achieved": 3,
      "achieved_capped": 3,
      "challenge_target_day": 3,
      "total_rate": "1.000",
      "remaining_to_100": 0
    },
    {
      "challenge_id": "ee787c9b-0e79-4daa-b115-550fcba98800",
      "title": "과학",
      "achieved": 0,
      "achieved_capped": 0,
      "challenge_target_day": 2,
      "total_rate": "0.000",
      "remaining_to_100": 2
    },
    {
      "challenge_id": "fe898210-f4c7-45e8-a836-632a620c66b5",
      "title": "백준 알고리즘 1문제",
      "achieved": 0,
      "achieved_capped": 0,
      "challenge_target_day": 3,
      "total_rate": "0.000",
      "remaining_to_100": 3
    }
  ]
}
```

## 최근 30일 달성률 : `GET /api/challenges/:id/progress/30days`

- 모든 챌린지

  - `day30Achieved` : 최근 30일까지 작성한 총 인증글 수
  - `day30Target` : 최근 30일까지 총 목표 인증글 수
  - `day30Rate` : 최근 30일까지 전체 달성률

- 개별 챌린지

  - `achieved_30d` : 오늘까지 수행한 인증글 수
  - `achieved_capped` : `LEAST(achieved, challenge_target_day)`
  - `target_30d`: 최근 30일까지 총 목표 인증글 수
  - `total_rate` : 최근 30일까지 총 달성률
  - `total_rate` : 남은 인증 횟수

```json
{
  "ok": true,
  "day30": {
    "day30Achieved": 13,
    "day30Target": 36,
    "day30Rate": 0.361
  },
  "achievedChallengesList": [
    {
      "challenge_id": "0520beb0-e07b-492e-8be3-ecd6d2b0dccc",
      "title": "수학 파이널 모의고사",
      "achieved_30d": 2,
      "achieved_30d_capped": 1,
      "target_30d": 1,
      "total_rate": "1.000",
      "remaining_to_100": 0
    },
    {
      "challenge_id": "106a5e7c-2199-458d-bb19-ae3bd117bbfd",
      "title": "경제 뉴스레터 읽기",
      "achieved_30d": 5,
      "achieved_30d_capped": 5,
      "target_30d": 11,
      "total_rate": "0.455",
      "remaining_to_100": 6
    },
    {
      "challenge_id": "212a6b88-023d-4d2e-bbc4-3d99634008af",
      "title": "물I 수능특강 전체 복습",
      "achieved_30d": 2,
      "achieved_30d_capped": 2,
      "target_30d": 2,
      "total_rate": "1.000",
      "remaining_to_100": 0
    },
    {
      "challenge_id": "293caa25-4aa4-4cd4-b462-99c71f544039",
      "title": "테스트 글",
      "achieved_30d": 0,
      "achieved_30d_capped": 0,
      "target_30d": 1,
      "total_rate": "0.000",
      "remaining_to_100": 1
    },
    {
      "challenge_id": "2c657b10-c5c9-4dd9-82e0-f3e9ae8c28d5",
      "title": "독서",
      "achieved_30d": 0,
      "achieved_30d_capped": 0,
      "target_30d": 10,
      "total_rate": "0.000",
      "remaining_to_100": 10
    },
    {
      "challenge_id": "433f49ad-e80e-4d60-883c-c747f629f2b7",
      "title": "국어 파이널 모의고사",
      "achieved_30d": 4,
      "achieved_30d_capped": 3,
      "target_30d": 3,
      "total_rate": "1.000",
      "remaining_to_100": 0
    },
    {
      "challenge_id": "6a921da8-04bb-47fa-8e7d-e1dbce5b136d",
      "title": "수능 영어 단어 복습",
      "achieved_30d": 2,
      "achieved_30d_capped": 2,
      "target_30d": 2,
      "total_rate": "1.000",
      "remaining_to_100": 0
    },
    {
      "challenge_id": "ee787c9b-0e79-4daa-b115-550fcba98800",
      "title": "과학",
      "achieved_30d": 0,
      "achieved_30d_capped": 0,
      "target_30d": 2,
      "total_rate": "0.000",
      "remaining_to_100": 2
    },
    {
      "challenge_id": "fe898210-f4c7-45e8-a836-632a620c66b5",
      "title": "백준 알고리즘 1문제",
      "achieved_30d": 0,
      "achieved_30d_capped": 0,
      "target_30d": 4,
      "total_rate": "0.000",
      "remaining_to_100": 4
    }
  ]
}
```
