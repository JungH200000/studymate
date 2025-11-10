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

## 2. Challenge 등록 화면

### POST: 챌린지 title, content 작성 및 기간 설정하여 게시

- `/api/challenges`

## 3. Home 화면

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

- `/api/reports/challenges/:id`

`{ target_type`: "challenge", `target_id: <challenge_id>, content: string }`

## 4. 검색

- 옵션: 페이지네이션 `page=1&limit=20&sort=newest`

### 챌린지 검색 : `GET /api/challenges?q=검색어

- `/api/challenges?q=검색어`

### 사용자 검색 : `GET /api/users?q=검색어

## 5. 인증글 목록

### 5.1 GET : 챌린지 기본 정보, 챌린지 좋아요/인증글 수/참여자 수, 챌린지 올린 사용자

- `/api/challenges/:id`

응답에 `author`, `like_count`, `post_count`, `participant_count` `liked_by_me`, `joined_by_me` 를 같이 포함

### 5.2 GET : 해당 챌린지의 인증글 목록(작성자, 응원 포함)

- `/api/challenges/:id/posts?page=1&limit=20&sort=newest`

인증글 목록은 posts와 users JOIN으로 가져옴

각 인증글에 post_id, content, created_at, author, cheer_count, cheered_by_me 포함.

UI에 “참여 횟수 5/7”을 보여줄 거면
author_progress: { achieved_this_week, target_per_week }

```json
{ "title": "...", "goals": ["..."], "summary": "...", "references": "...", "insights": "...", "comment": "..." }
```

### 5.3 POST : 좋아요/응원 버튼 클릭, 참여 버튼 클릭

- 챌린지 참여 : `/api/challenges/:id/participants`
- 챌린지 좋아요 : `/api/challenges/:id/likes`
- 인증글 응원 : `/api/challenges/posts/:id/cheers`

### 5.4 DELETE : 좋아요/응원 취소, 참여 취소

- 챌린지 참여 : `/api/challenges/:id/participants`
- 챌린지 좋아요 : `/api/challenges/:id/likes`
- 인증글 응원 : `/api/challenges/posts/:id/cheers`

좋아요/응원/참여 POST DELETE 응답에 갱신된 카운트와 상태를 돌려줘야 프론트가 추가 GET 없이 즉시 반영 가능: { like_count, liked_by_me }, { participant_count, joined_by_me}, { cheer_count, cheered_by_me }.

### 5.5 POST : 인증 글 게시

- `/api/challenges/:id/posts`

```json
{ "title": "...", "goals": ["..."], "summary": "...", "references": "...", "insights": "...", "comment": "..." }
```

참여자만 게시 가능하도록 `joined_by_me` 체크

### 5.6 POST: 부적절한 인증글 신고

- `/api/reports/posts/:id`

`{ target_type`: "post", `target_id: <post_id>, content: string }`

## 6. 사용자 페이지

### 6.1 유저 정보

- 챌린지와 인증글 목록을 불러올 때 해당 글의 작성자의 user_id와 username을 함께 가져왔었음
- 상대방 페이지에서는 상대방 이메일이 출력되지 않도록 설정

#### 본인 정보 : `GET /api/me`

#### 상대방 정보 : `GET /api/users/:id`

### 6.2 사용자가 생성/참여한 챌린지 목록

- 챌린지와 인증글 목록을 불러올 때 해당 글의 작성자의 user_id와 username을 함께 가져왔었음
- `joined_by_me`와 `liked_by_me`는 로그인 중인 본인이 챌린지에 참여 유무와 좋아요 유무를 나타냄(타 사용자 페이지에서도 마찬가지)
- 옵션: 목록은 페이지네이션 `...&page=1&limit=20&sort=newest`

#### 본인 : `GET /api/me/challenges?type=??`

- type은 joined(참여)와 created(생성) 둘 중 하나

#### 상대방 : `GET /api/users/:id/challenges?type=??`

- type은 joined(참여)와 created(생성) 둘 중 하나

### 6.3 팔로우

#### 팔로우 : `POST /api/users/:id/follow`

#### 언팔로우 : `DELETE /api/users/:id/follow`

#### 팔로워 목록 : `GET /api/users/:id/followers`

- 나를 팔로우한 사용자들

#### 팔로잉 목록 : `GET /api/users/:id/followings`

- 내가 팔로우한 사용자들

### 6.4 달성률

#### 이번 주 : `GET /api/challenges/:id/progress/week`

#### 전체 : `GET /api/challenges/:id/progress/total`

#### 이번 달 : `GET /api/challenges/:id/progress/30days`

## 7. 달성률 랭킹

- `/api/challenges/rankings`

- 옵션: 페이지네이션 `...?page=1&limit=50`
