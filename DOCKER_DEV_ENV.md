# 도커 기반 개발 환경 가이드

## 📋 목차
1. [필요한 도구 및 파일](#필요한-도구-및-파일)
2. [프로젝트 구조](#프로젝트-구조)
3. [환경 설정](#환경-설정)
4. [서비스 실행](#서비스-실행)
5. [개발 워크플로우](#개발-워크플로우)
6. [트러블슈팅](#트러블슈팅)

---

## 필요한 도구 및 파일

### 필수 도구
- **Docker Desktop** (Windows/Mac) 또는 **Docker Engine + Docker Compose** (Linux)
- **Git** (프로젝트 클론용)

### 프로젝트 파일 구조
```
danawa-py-crawler/
├── docker-compose.yml          # 전체 서비스 오케스트레이션
├── Dockerfile.crawler          # Python 크롤러 이미지
├── Dockerfile.summarizer       # Python 요약 서비스 이미지
├── .dockerignore              # Docker 빌드 시 제외할 파일
├── .env                       # 환경 변수 (로컬 설정)
├── .env.example               # 환경 변수 템플릿
├── requirements.txt            # Python 크롤러 의존성
├── requirements_summarize.txt  # Python 요약 서비스 의존성
├── crawler.py                  # 크롤러 스크립트
├── summarize_reviews.py        # 리뷰 요약 스크립트
└── webservice/
    ├── Dockerfile              # Spring Boot 백엔드 이미지
    ├── pom.xml                 # Maven 의존성
    └── frontend/
        ├── Dockerfile          # React 프론트엔드 이미지
        └── package.json        # Node.js 의존성
```

---

## 프로젝트 구조

### 서비스 구성
1. **db** (MySQL 8.0)
   - 데이터베이스 서버
   - 포트: `3307:3306` (호스트:컨테이너)
   - 볼륨: `db_data` (데이터 영구 저장)

2. **backend** (Spring Boot)
   - Java 17, Maven 빌드
   - 포트: `8080:8080`
   - DB 연결: `db:3306`

3. **frontend** (React)
   - Node.js LTS
   - 포트: `3000:3000`
   - 개발 모드: 핫 리로드 지원

4. **crawler** (Python)
   - Python 3.11, Playwright
   - 수동 실행 전용 (profiles: manual)
   - 볼륨 마운트: 소스 코드 실시간 반영

5. **summarizer** (Python)
   - Python 3.11
   - 수동 실행 전용 (profiles: manual)

---

## 환경 설정

### 1. 환경 변수 파일 생성

`.env` 파일을 프로젝트 루트에 생성:

```bash
# .env 파일 생성
cp .env.example .env
```

`.env` 파일 내용:
```env
# Google Gemini API Key
GOOGLE_API_KEY=your_api_key_here
```

> **API 키 발급**: [Google AI Studio](https://aistudio.google.com/app/apikey)

### 2. Docker 네트워크 및 볼륨

`docker-compose.yml`에서 자동으로 생성:
- **네트워크**: `danawa-net` (bridge)
- **볼륨**: `db_data` (MySQL 데이터)

---

## 서비스 실행

### 전체 서비스 실행 (DB + Backend + Frontend)

```bash
# 백그라운드 실행
docker-compose up -d db backend frontend

# 로그 확인
docker-compose logs -f

# 특정 서비스 로그만 확인
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 개별 서비스 실행

```bash
# DB만 실행
docker-compose up -d db

# Backend만 실행 (DB 의존)
docker-compose up -d backend

# Frontend만 실행
docker-compose up -d frontend
```

### 크롤러 실행 (수동)

```bash
# 기본 실행
docker-compose run --rm crawler python crawler.py

# 리뷰 수집 포함
docker-compose run --rm crawler python crawler.py --reviews

# 대화형 모드
docker-compose run -it --rm crawler bash
```

### 요약 서비스 실행 (수동)

```bash
# 리뷰 요약 실행
docker-compose run --rm summarizer python summarize_reviews.py
```

### 서비스 중지 및 정리

```bash
# 서비스 중지 (컨테이너 유지)
docker-compose stop

# 서비스 중지 및 컨테이너 제거
docker-compose down

# 볼륨까지 삭제 (데이터 삭제 주의!)
docker-compose down -v
```

---

## 개발 워크플로우

### 1. 초기 설정

```bash
# 1. 프로젝트 클론
git clone <repository-url>
cd danawa-py-crawler

# 2. 환경 변수 설정
cp .env.example .env
# .env 파일에 GOOGLE_API_KEY 입력

# 3. 서비스 빌드 및 실행
docker-compose up -d --build
```

### 2. 개발 중 코드 수정

#### Frontend (React)
- `webservice/frontend/src/` 디렉토리 수정
- **자동 반영**: 볼륨 마운트로 실시간 반영
- 브라우저에서 자동 새로고침

#### Backend (Spring Boot)
- `webservice/src/` 디렉토리 수정
- **재빌드 필요**: 
  ```bash
  docker-compose up -d --build backend
  ```

#### Crawler (Python)
- `crawler.py` 수정
- **즉시 반영**: 볼륨 마운트로 실시간 반영
- 재실행: `docker-compose run --rm crawler python crawler.py`

### 3. 데이터베이스 접속

```bash
# MySQL 컨테이너 접속
docker-compose exec db mysql -u root -p1234 danawa

# 또는 외부 도구 사용
# Host: localhost
# Port: 3307
# User: root
# Password: 1234
# Database: danawa
```

### 4. 로그 확인

```bash
# 모든 서비스 로그
docker-compose logs -f

# 특정 서비스 로그
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# 최근 100줄만 확인
docker-compose logs --tail=100 backend
```

---

## 트러블슈팅

### 포트 충돌

**문제**: 포트가 이미 사용 중
```
Error: bind: address already in use
```

**해결**:
1. `docker-compose.yml`에서 포트 변경
2. 또는 기존 프로세스 종료

### DB 연결 실패

**문제**: Backend가 DB에 연결하지 못함

**해결**:
```bash
# DB 상태 확인
docker-compose ps db

# DB 로그 확인
docker-compose logs db

# DB 재시작
docker-compose restart db

# Backend 재시작 (DB가 준비된 후)
docker-compose restart backend
```

### 이미지 빌드 실패

**문제**: Dockerfile 빌드 중 오류

**해결**:
```bash
# 캐시 없이 재빌드
docker-compose build --no-cache

# 특정 서비스만 재빌드
docker-compose build --no-cache backend
```

### 볼륨 권한 문제 (Linux)

**문제**: 볼륨 마운트 시 권한 오류

**해결**:
```bash
# 볼륨 소유자 변경
sudo chown -R $USER:$USER ./webservice/frontend/src
```

### Playwright 브라우저 오류

**문제**: 크롤러에서 브라우저 실행 실패

**해결**:
```bash
# 크롤러 이미지 재빌드
docker-compose build --no-cache crawler
```

### 프론트엔드 핫 리로드 미작동

**문제**: 코드 수정 후 자동 새로고침 안 됨

**해결**:
1. `docker-compose.yml`의 `CHOKIDAR_USEPOLLING=true` 확인
2. 프론트엔드 재시작:
   ```bash
   docker-compose restart frontend
   ```

---

## 유용한 명령어

### 컨테이너 관리
```bash
# 실행 중인 컨테이너 확인
docker-compose ps

# 컨테이너 내부 접속
docker-compose exec backend bash
docker-compose exec frontend sh
docker-compose exec db bash

# 컨테이너 리소스 사용량 확인
docker stats
```

### 이미지 관리
```bash
# 사용하지 않는 이미지 삭제
docker image prune -a

# 모든 컨테이너, 이미지, 볼륨 삭제 (주의!)
docker system prune -a --volumes
```

### 데이터베이스 백업/복원
```bash
# 백업
docker-compose exec db mysqldump -u root -p1234 danawa > backup.sql

# 복원
docker-compose exec -T db mysql -u root -p1234 danawa < backup.sql
```

---

## 접속 URL

- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:8080
- **API 문서**: http://localhost:8080/swagger-ui.html (설정된 경우)
- **데이터베이스**: localhost:3307

---

## 참고 문서

- [로컬 설정 가이드](./LOCAL_SETUP_GUIDE.md)
- [크롤러 사용법](./CRAWLER_README.md)
- [Docker 공식 문서](https://docs.docker.com/)
- [Docker Compose 공식 문서](https://docs.docker.com/compose/)

