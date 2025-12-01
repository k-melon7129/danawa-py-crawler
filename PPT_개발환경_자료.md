# 프로젝트 개발 환경 (PPT 자료)

---

## 슬라이드 1: 개발 환경 개요

### 도커 기반 개발 환경
- **목적**: 일관된 개발 환경 제공, 배포 간소화
- **주요 도구**: Docker Desktop, Docker Compose
- **장점**: 
  - 환경 차이 최소화
  - 빠른 환경 구축
  - 의존성 관리 용이

---

## 슬라이드 2: 기술 스택

### 프론트엔드
- **React 18** (Node.js LTS)
- 포트: 3000

### 백엔드
- **Spring Boot 3.2** (Java 17, Maven)
- 포트: 8080

### 데이터베이스
- **MySQL 8.0**
- 포트: 3307

### 크롤러
- **Python 3.11** (Playwright)
- 수동 실행

### AI 서비스
- **Google Gemini 1.5 Flash**

---

## 슬라이드 3: 프로젝트 구조

```
danawa-py-crawler/
├── docker-compose.yml          # 전체 서비스 오케스트레이션
├── Dockerfile.crawler          # 크롤러 이미지
├── Dockerfile.summarizer       # 요약 서비스 이미지
├── .dockerignore              # 빌드 제외 파일
├── .env                       # 환경 변수
├── requirements.txt           # Python 의존성
└── webservice/
    ├── Dockerfile             # 백엔드 이미지
    └── frontend/
        └── Dockerfile         # 프론트엔드 이미지
```

---

## 슬라이드 4: 서비스 구성

### 5개 서비스

1. **DB (MySQL)**
   - 데이터 영구 저장 (볼륨)
   - Health Check 포함

2. **Backend (Spring Boot)**
   - DB 의존성 관리
   - API 서버

3. **Frontend (React)**
   - 핫 리로드 지원
   - 개발 모드

4. **Crawler (Python)**
   - 수동 실행 전용
   - Playwright 브라우저

5. **Summarizer (Python)**
   - 수동 실행 전용
   - AI 리뷰 요약

---

## 슬라이드 5: 네트워크 및 볼륨

### Docker 네트워크
- **danawa-net** (bridge)
- 모든 서비스가 동일 네트워크에서 통신

### 볼륨
- **db_data**: MySQL 데이터 영구 저장
- **소스 코드 마운트**: 실시간 반영 (개발 편의)

### 포트 매핑
- Frontend: `3000:3000`
- Backend: `8080:8080`
- DB: `3307:3306`

---

## 슬라이드 6: 환경 설정

### 필수 요구사항
1. **Docker Desktop** 설치
2. **Google Gemini API Key** 발급
   - https://aistudio.google.com/app/apikey

### 설정 파일
```env
# .env 파일
GOOGLE_API_KEY=your_api_key_here
```

### 초기 설정 명령어
```bash
# 1. 환경 변수 설정
cp .env.example .env

# 2. 서비스 실행
docker-compose up -d --build
```

---

## 슬라이드 7: 실행 방법

### 전체 서비스 실행
```bash
docker-compose up -d db backend frontend
```

### 개별 서비스 실행
```bash
# DB만
docker-compose up -d db

# Backend만 (DB 의존)
docker-compose up -d backend

# Frontend만
docker-compose up -d frontend
```

### 크롤러 실행 (수동)
```bash
docker-compose run --rm crawler python crawler.py
```

---

## 슬라이드 8: 개발 워크플로우

### 코드 수정 시

**Frontend (React)**
- 소스 수정 → 자동 반영 (핫 리로드)

**Backend (Spring Boot)**
- 소스 수정 → 재빌드 필요
  ```bash
  docker-compose up -d --build backend
  ```

**Crawler (Python)**
- 소스 수정 → 즉시 반영 (볼륨 마운트)

### 로그 확인
```bash
docker-compose logs -f [서비스명]
```

---

## 슬라이드 9: 접속 정보

### 서비스 URL
- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:8080
- **데이터베이스**: localhost:3307

### 데이터베이스 접속 정보
- Host: localhost
- Port: 3307
- User: root
- Password: 1234
- Database: danawa

---

## 슬라이드 10: 주요 명령어

### 서비스 관리
```bash
# 실행
docker-compose up -d

# 중지
docker-compose stop

# 중지 및 삭제
docker-compose down

# 재빌드
docker-compose up -d --build
```

### 로그 및 모니터링
```bash
# 로그 확인
docker-compose logs -f

# 컨테이너 상태
docker-compose ps

# 리소스 사용량
docker stats
```

---

## 슬라이드 11: 장점 및 특징

### 도커 기반 개발 환경의 장점

✅ **환경 일관성**
- 개발자마다 동일한 환경
- "내 컴퓨터에서는 되는데" 문제 해결

✅ **빠른 설정**
- 한 번의 명령어로 전체 환경 구축
- 신규 개발자 온보딩 시간 단축

✅ **의존성 격리**
- 로컬 환경 오염 방지
- 버전 충돌 방지

✅ **배포 간소화**
- 개발 환경과 프로덕션 환경 유사
- 컨테이너 기반 배포 가능

---

## 슬라이드 12: 트러블슈팅

### 자주 발생하는 문제

**포트 충돌**
- 해결: `docker-compose.yml`에서 포트 변경

**DB 연결 실패**
- 해결: DB Health Check 대기 후 Backend 재시작

**이미지 빌드 실패**
- 해결: `docker-compose build --no-cache`

**프론트엔드 핫 리로드 미작동**
- 해결: `CHOKIDAR_USEPOLLING=true` 확인

---

## 슬라이드 13: 프로젝트 아키텍처

```
┌─────────────┐
│  Frontend   │ (React)
│  :3000      │
└──────┬──────┘
       │ HTTP
┌──────▼──────┐
│  Backend    │ (Spring Boot)
│  :8080      │
└──────┬──────┘
       │ JDBC
┌──────▼──────┐
│     DB      │ (MySQL)
│   :3307     │
└─────────────┘

┌─────────────┐
│  Crawler    │ (Python)
│  (수동 실행) │
└──────┬──────┘
       │
┌──────▼──────┐
│     DB      │
└─────────────┘
```

---

## 슬라이드 14: 요약

### 개발 환경 핵심 포인트

🔧 **도구**: Docker Desktop + Docker Compose

📦 **서비스**: 5개 (DB, Backend, Frontend, Crawler, Summarizer)

🚀 **실행**: `docker-compose up -d`

🌐 **접속**: 
- Frontend: http://localhost:3000
- Backend: http://localhost:8080

💡 **장점**: 환경 일관성, 빠른 설정, 의존성 격리

