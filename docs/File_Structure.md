# server 폴더 구조

```
studymate/server/
├─ node_modules/
├─ src/
│ ├─ controllers/
│ │ ├─ auth.controller.js
│ │ ├─ challenge.controller.js
│ │ ├─ post.controller.js
│ │ ├─ report.controller.js
│ │ └─ user.controller.js
│ │
│ ├─ db/
│ │ ├─ migrations/
│ │ │ ├─ 001_init.sql
│ │ │ ├─ 002_postsIndex.sql
│ │ │ ├─ 003_postsAddColumn.sql
│ │ │ ├─ 004_reportsAddUnique.sql
│ │ │ └─ 005_tags.sql
│ │ │
│ │ ├─ auth.db.js
│ │ ├─ challenge.db.js
│ │ ├─ pool.js
│ │ ├─ post.db.js
│ │ ├─ report.db.js
│ │ ├─ user.db.js
│ │ └─ userTag.db.js
│ │
│ ├─ middleware/
│ │ ├─ challenge.validators.js
│ │ └─ requireAuth.js
│ │
│ ├─ routes/
│ │ ├─ auth.routes.js
│ │ ├─ challenge.routes.js
│ │ ├─ me.routes.js
│ │ ├─ post.routes.js
│ │ ├─ report.routes.js
│ │ ├─ test.routes.js
│ │ └─ users.routes.js
│ │
│ ├─ services/
│ │ ├─ auth.service.js
│ │ ├─ challenge.service.js
│ │ ├─ checkAbuse.service.js
│ │ ├─ post.service.js
│ │ ├─ report.service.js
│ │ └─ user.service.js
│ │
│ ├─ utils/
│ │ ├─ asyncHandler.js
│ │ ├─ auth.validators.js
│ │ ├─ extractionText.js
│ │ ├─ geminiAPI.js
│ │ ├─ geminiSchema.js
│ │ ├─ jwt.js
│ │ └─ rankCache.js
│ │
│ ├─ worker/
│ │ └─ geminiWorker.js
│ │
│ ├─ env.js
│ └─ server.js
│
├─ .env
├─ .gitignore
├─ package-lock.json
└─ package.json

---
```
