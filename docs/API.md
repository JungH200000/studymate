# API 문서

인증 필요한 API 호출 시 헤더에 `Authorization: Bearer <accessToken>` 붙여서 요청하고 refresh 요청 및 로그인 이후 API 호출은 `credentials: 'include'`(fetch) / `withCredentials: true` (axios)로 쿠키 동봉

## 1. 회원가입/로그인/로그아웃

### 전부 POST method

- `/api/auth/login`
- `/api/auth/register`
- `/api/auth/refresh`
- `/api/auth/logout`

로그인하면 백엔드에서 access token을 생성하고 response로 넘겨주고, access token은 15분, refresh token은 7일로 설정.
프론트엔드에서 이걸 변수에 저장해서 다른 api 요청할 때 헤더로 넘겨주고, access token이 다 돼서 오류 발생시 `/api/auth/refresh` 호출.

## 2. Home 화면

### GET : 챌린지 목록, 챌린지별 좋아요/인증글 수/참여자 수, 챌린지 올린 사용자 보여주기

- `/api/challenges`

### POST : 좋아요 버튼 클릭, 참여 버튼 클릭

- 참여 : `/api/challenges/:id/participants`
- 좋아요 : `/api/challenges/:id/likes`

### DELETE : 좋아요 취소, 참여 취소

- 참여 : `/api/challenges/:id/participants`
- 좋아요 : `/api/challenges/:id/likes`

챌린지 올린 사용자 같은 경우는 `challenges` table과 `users` table을 `JOIN`해서 작성자 정보를 가져옴.

차후 무한스크롤 대비 `GET /api/challenges?page=1&limit=20&sort=newest`

응답에 `author`, `like_count`, `liked_by_me`, `post_count`, `participant_count`, `joined_by_me`를 같이 포함

### POST: 부적절한 챌린지 신고

- `/api/reports/:challenge_id`

`{ target_type`: "challenge", `target_id: <challenge_id>, content: string }`

## 3. Challenge 등록 화면

### POST: 챌린지 title, content 작성 및 기간 설정하여 게시

- `/api/challenges`

## 4. 인증글 피드

### GET : 챌린지 기본 정보, 챌린지 좋아요/인증글 수/참여자 수, 챌린지 올린 사용자

- `/api/challenges/:id`

응답에 `author`, `like_count`, `post_count`, `participant_count` `liked_by_me`, `joined_by_me` 를 같이 포함

### GET : 해당 챌린지의 인증글 목록(작성자, 응원 포함)

- `/api/challenges/:id/posts?page=1&limit=20&sort=newest`

인증 피드 글은 posts와 users JOIN으로 가져옴

각 인증글에 post_id, content, created_at, author, cheer_count, cheered_by_me 포함.

UI에 “참여 횟수 5/7”을 보여줄 거면
author_progress: { achieved_this_week, target_per_week }

```json
{ "title": "...", "goals": ["..."], "summary": "...", "references": "...", "insights": "...", "comment": "..." }
```

### POST : 좋아요/응원 버튼 클릭, 참여 버튼 클릭

- 챌린지 참여 : `/api/challenges/:id/participants`
- 챌린지 좋아요 : `/api/challenges/:id/likes`
- 인증글 응원 : `/api/challenges/posts/:id/cheers`

### DELETE : 좋아요/응원 취소, 참여 취소

- 챌린지 참여 : `/api/challenges/:id/participants`
- 챌린지 좋아요 : `/api/challenges/:id/likes`
- 인증글 응원 : `/api/challenges/posts/:id/cheers`

좋아요/응원/참여 POST DELETE 응답에 갱신된 카운트와 상태를 돌려줘야 프론트가 추가 GET 없이 즉시 반영 가능: { like_count, liked_by_me }, { participant_count, joined_by_me}, { cheer_count, cheered_by_me }.

### POST : 인증 글 게시

- `/api/challenges/:id/posts`

```json
{ "title": "...", "goals": ["..."], "summary": "...", "references": "...", "insights": "...", "comment": "..." }
```

참여자만 게시 가능하도록 `joined_by_me` 체크

### POST: 부적절한 인증글 신고

- `/api/reports/:post_id`

`{ target_type`: "post", `target_id: <post_id>, content: string }`

## 사용자 페이지

### GET : 본인 프로필, 팔로워, 달성률 재료

- `/api/me`

### GET : 본인 등록/참여 챌린지 목록

- `/api/me/challenges?type=...`

`type=created`, `type=joined`

목록은 페이지네이션 `/api/me/challenges?type=...&page=1&limit=20&sort=newest`

### GET : 상대방 프로필, 팔로워, 달성률 재료

- `/api/users/:user_id`

### GET : 상대방 등록/참여 챌린지 목록

- `/api/users/:user_id/challenges?type=...`

`type=created`, `type=joined`

목록은 페이지네이션 `/api/users/:user_id/challenges?type=...&page=1&limit=20&sort=newest`

### POST : 팔로우

- `/api/users/:id/follow`

### DELETE : 언팔로우

- `/api/users/:id/follow`

응답: { follower_count, is_following }

## 검색

### GET : 챌린지 title 기준으로 검색

- `/api/challenges?q=검색어&page=1&limit=20&sort=newest`
