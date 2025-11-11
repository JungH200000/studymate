# 인증글 등록 시 AI 욕설·비방 검증 기능 : `POST /api/challenges/:id/posts`

- 4~6초 정도 소요됨 -> 그 동안 프론트엔드에서는 인증글 하나 크기의 로딩을 보여주는 걸로 설정 -> 성공하면 인증글을 보여주고 거부되면 인증/비방글이 포함되었다는 안내문 출력

```request
{
  "content": {
    "tags": ["#사회탐구", "#생활과윤리", "#롤스", "#정의론", "#차등의원칙", "#개념복습", "#수능사탐"],
    "goals": ["롤스의 두 가지 정의 원칙과 원초적 입장 개념을 정확하게 구분하고 문제에 적용하기"],
    "title": "생윤: 롤스의 정의론 핵심 개념 완파!",
    "summary": "롤스의 정의의 원칙 (자유 우선의 원칙, 차등의 원칙)을 복습하고, 특히 최소 수혜자 최대 이익의 의미를 기출 선지를 통해 확인했다. 무지의 베일 개념을 다시 정리함.\n\n[테스트] 욕설/비방 검증용 문구: 씨발, 꺼져, 미친놈, 죽여버린다.",
    "materials": {
      "textbook": {
        "name": "[본인이 쓰는 사탐 문제집 이름]",
        "pageEnd": 120,
        "pageStart": 110
      }
    },
    "nextSteps": ["윤리와 사상: 공리주의 (벤담/밀) 핵심 정리", "롤스 VS 노직 비교 문제 심화 풀이"],
    "takeaways": "롤스의 정의론이 분배적 정의의 다른 이론들(노직 등)과 어떻게 다른지 명확하게 정리할 수 있었다. 개념은 쉬운데 선지에서 헷갈리는 부분이 많아 개념어 정의를 다시 한번 확인하는 것이 중요함을 깨달았다.",
    "studyMinutes": 70,
    "studyDurationText": "1시간 10분",
    "abuseTestPhrases": [
      "욕설 테스트: 씨발 진짜 짜증난다.",
      "비방 테스트: 너 같은 멍청이는 끼어들지 마.",
      "모욕 테스트: 한심한 놈.",
      "위협 테스트: 또 이러면 죽여버린다.",
      "완곡형(은어) 테스트: 시*발, 지*랄, ㅅㅂ."
    ]
  }
}
```

- response

```json
{
  "ok": false,
  "code": "POST_REJECTED_ABUSE",
  "message": "욕설·비방이 포함된 인증글은 등록할 수 없습니다."
}
```

```terminal
Error 발생 !!!
 Error: 욕설·비방이 포함된 인증글은 등록할 수 없습니다.
    at Module.createPost (file:///C:/studymate/server/src/services/post.service.js:34:21)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async createPost (file:///C:/studymate/server/src/controllers/post.controller.js:27:78) {
  status: 422,
  code: 'POST_REJECTED_ABUSE',
  detail: { reasons: [ '욕설', '모욕', '비방', '폭력적', '위험한' ] }
}
```
