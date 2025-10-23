# server

```terminal
cd server
npm install
```

```terminal
npm run dev
```

routes -> db(repo) -> controller -> service(DB) -> controller 응답 -> route 반환

## Frontend Settings

### 1. Cookie 설정

- `fetch` 사용 시 `credentials: 'include'` 사용
- `axios` 사용 시 `withCredentials = true` 사용

=> 쿠키를 같이 보내야 하기 때문

### 2. Proxy 설정

AVD가 아닌 실제 디바이스를 이용할 때 주소 : 127.0.0.1

```terminal
adb devices
adb reverse tcp:5173 tcp:5173
adb reverse tcp:3000 tcp:3000
```

리액트 앱(vite)

- npm run dev (--host 옵션 추가)
- `vite.config.json`
  - server: { proxy: { "/api": "http://127.0.0.1:3000" }, }, => '/api` 경로로 들어오면 "http://127.0.0.1:3000" 이 주소로 리버스 프록시
