# AI 추천 챌린지용 인증글 더미 데이터

- AI 추천 챌린지 기능을 보여주기 위해 추가하는 더미 데이터
- 인증글을 추가한 후 supabase db에서 posts table에서 posted_date_kst와 created_at column을 다른 날짜로 수정하면 됨. (단, 두 column을 동일한 날짜로 수정하기)
- UI를 캡쳐하거나 시연 영상을 찍을 때 사용할 유저로 인증글 올리기

### 챌린지 1: 수학 문제집 하루 2장 — 인증글 3개

626cc991-3a6b-4561-be7a-7de5fc15c7d6

```json
[
  {
    "content": {
      "title": "Week 1 - 기하 기본 도형",
      "goals": ["유형 A, B 각 1장", "틀린 문제 오답노트 작성"],
      "summary": "삼각형 성질과 닮음 조건 문제 풀이. 각도 단위 변환에서 실수 확인.",
      "takeaways": "공식 암기보다 조건 체크 리스트가 중요.",
      "materials": {
        "textbook": { "name": "블랙라벨 수학(기하)", "pageStart": 12, "pageEnd": 15 },
        "lecture": { "teacher": "이수학", "series": "기하 개념끝", "lessonStart": 1, "lessonEnd": 1 },
        "links": []
      },
      "studyMinutes": 80,
      "studyDurationText": "1시간 20분",
      "nextSteps": ["닮음 응용 문제 추가 풀이"],
      "tags": ["수학", "기하"]
    }
  },
  {
    "content": {
      "title": "Week 1 - 닮음 응용 연습",
      "goals": ["유형 C 1장", "헷갈린 조건 정리"],
      "summary": "평행선 닮음비 활용 문제 집중. 비례식 세팅 속도 개선.",
      "takeaways": "도형에 보조선 추가하니 풀이가 단순해짐.",
      "materials": {
        "textbook": { "name": "블랙라벨 수학(기하)", "pageStart": 16, "pageEnd": 18 },
        "lecture": { "teacher": "이수학", "series": "기하 개념끝", "lessonStart": 2, "lessonEnd": 2 },
        "links": []
      },
      "studyMinutes": 90,
      "studyDurationText": "1시간 30분",
      "nextSteps": ["유형 D에서 실전 시간 재며 풀기"],
      "tags": ["수학", "기하"]
    }
  },
  {
    "content": {
      "title": "Week 2 - 평행선과 비례",
      "goals": ["유형 D 1장", "비례 배분 문제 정리"],
      "summary": "평행선 성질로 길이 비 구하는 문제 풀이. 방정식 세팅 연습.",
      "takeaways": "그림에 길이 표시를 미리 해두면 실수가 줄어듦.",
      "materials": {
        "textbook": { "name": "블랙라벨 수학(기하)", "pageStart": 19, "pageEnd": 21 },
        "lecture": { "teacher": "이수학", "series": "기하 개념끝", "lessonStart": 3, "lessonEnd": 3 },
        "links": []
      },
      "studyMinutes": 75,
      "studyDurationText": "1시간 15분",
      "nextSteps": ["삼각형 외심/내심 파트 예습"],
      "tags": ["수학", "기하"]
    }
  }
]
```

### 챌린지 3: 영단어 30개 암기 — 인증글 1개

95d600ef-b05b-4d14-aec0-93d00609e48d

```json
[
  {
    "content": {
      "title": "Day 1 - 30개 암기 완료",
      "goals": ["신규 30개 암기", "예문 30문장 작성"],
      "summary": "고교 필수 어휘 위주로 암기. 유사어/반의어 묶어서 정리.",
      "takeaways": "연상법이 효과적. 예문까지 쓰면 기억에 더 남음.",
      "materials": {
        "textbook": { "name": "수능 필수 어휘 1800", "pageStart": 1, "pageEnd": 5 },
        "lecture": { "teacher": "김영어", "series": "어휘 기초", "lessonStart": 1, "lessonEnd": 1 },
        "links": []
      },
      "studyMinutes": 90,
      "studyDurationText": "1시간 30분",
      "nextSteps": ["복습용 퀴즈 만들기"],
      "tags": ["영단어", "암기"]
    }
  }
]
```

### 챌린지 4 ㅡ 인증글 1개

ddb1914b-f337-4d49-baeb-f909532bd3f4

```json
[
  {
    "content": {
      "title": "Week 1 - 이항분포 & 신뢰구간 20제",
      "goals": ["제한시간 40분 내 20문항 풀이", "오답 해설 요약 및 개념 보완"],
      "summary": "이항분포의 기댓값·분산 계산과 표본평균의 분포를 다룸. 신뢰구간 설정에서 표준편차 미지의 경우 t-분포 선택을 놓친 문제 다수.",
      "takeaways": "조건부확률을 곧바로 곱셈법칙으로 가기 전에 사건 분해가 필요한지 먼저 점검해야 실수가 줄어듦.",
      "materials": {
        "textbook": { "name": "수능 확률과 통계 실전 100제", "pageStart": 101, "pageEnd": 105 },
        "lecture": { "teacher": "박통계", "series": "확통 핵심 실전", "lessonStart": 1, "lessonEnd": 1 },
        "links": []
      },
      "studyMinutes": 80,
      "studyDurationText": "1시간 20분",
      "nextSteps": ["정규근사 조건 정리 및 표본크기 영향 복습"],
      "tags": ["확률분포", "통계추정"]
    }
  },
  {
    "content": {
      "title": "Week 2 - 정규근사 & 표본크기 효과 20제",
      "goals": [
        "이항분포의 정규근사 조건 정리(np, n(1-p) 체크)",
        "연속성 보정 적용 문제 10문항",
        "표본크기 변화가 표준오차/신뢰구간에 미치는 영향 10문항 정리"
      ],
      "summary": "이항분포를 정규분포로 근사할 때 조건(np, n(1-p) ≥ 5)을 먼저 점검하고, X ≤ k/ X ≥ k 형태에서 연속성 보정(±0.5)을 적용해 적분구간을 설정함. 표본크기 n이 커질수록 표준오차가 1/√n으로 감소하여 신뢰구간 길이가 줄어드는 점을 수치 예시로 확인.",
      "takeaways": "① 조건 점검 → ② 연속성 보정 → ③ Z-표준화 순서로 풀면 실수가 크게 줄어듦. 신뢰구간 폭은 표준편차가 아닌 표준오차(SE=σ/√n)에 의해 결정됨.",
      "materials": {
        "textbook": { "name": "수능 확률과 통계 실전 100제", "pageStart": 106, "pageEnd": 110 },
        "lecture": { "teacher": "박통계", "series": "확통 핵심 실전", "lessonStart": 2, "lessonEnd": 2 },
        "links": []
      },
      "studyMinutes": 85,
      "studyDurationText": "1시간 25분",
      "nextSteps": ["표본비율의 신뢰구간(z-근사)과 카이제곱 검정(적합도/독립성) 예습"],
      "tags": ["정규근사", "신뢰구간", "확률분포"]
    }
  }
]
```
