# ClusHub - GitHub “Issue 클러스터링 대시보드” 서비스

GitHub 저장소의 Issue 데이터를 자동으로 수집하고, **유사한 이슈를 클러스터링**하여 초보 개발자나 저장소 관리자가 **쉽게 중복 이슈를 확인**하고 **해결 전략을 세울 수 있도록 돕는** 대시보드 서비스입니다.

---

## 개발 의도

초보 개발자는 개발 과정에서 라이브러리 호환성이나 충돌 오류가 발생했을 때 AI 도구를 활용하더라도 연쇄적인 오류가 발생하여 문제 해결이 어렵고 결국 해당 라이브러리의 GitHub Issue탭을 일일이 탐색해 해결 방법을 찾아야 하는 불편함을 겪습니다. 이러한 경험을 바탕으로 **초보자도 쉽게 중복 이슈를 파악하고 해결 단서를 얻을 수 있는 ‘GitHub 이슈 클러스터링 대시보드’ 서비스**를 기획하였습니다.

---

## 역할 분담

- 김지훈: 프론트엔드
- 박정현: 백엔드, 임베딩, 클러스터링
- 한진환: 프론트엔드, 전처리

---

## 기술 스택

- Frontend: Morpheus(유라클), `React` – 대시보드 UI, 클러스터 목록(또는 시각화)
- Backend: `Node.js`(`Express`) – GitHub API 호출, Python 서버 연동, DB 저장
- AI Processing: Python - 전처리, 임베딩, 클러스터링
- Embedding: `sentence-transformers`(`all-MiniLM-L6-v2`)
- Clustering: `hdbscan`(`HDBSCAN`)
- DB: PostgreSQL(+pgvector)
- (선택)Visualization: `Recharts`/`Chart.js` 등 – 클러스터별 통계 시각화

---

## 한 줄 Archeticture

**React(Morpheus WebView)** ⟷ **Node.js(Express, GitHub REST API)** ⟷ **Python(전처리, Embedding, Clustering)** ⟶ **PostgreSQL(+pgvector)**
