![NACOM](public/nacom-logo.png)

# KIT Vibe Coding Frontend

온라인 강의 플랫폼의 프런트엔드 애플리케이션입니다.  
`React + TypeScript + Vite` 기반이며, 학생/강사 화면과 동영상 학습 기능(로그, 이어보기, 중간 퀴즈, 자막)을 포함합니다.

## 핵심 기능

- 학생
  - 강좌 목록/상세/수강 페이지
  - 영상 시청 로그 전송 (`PLAY`, `PAUSE`, `SEEK`, `HEARTBEAT`, `ENDED`, `PAGE_EXIT`)
  - 마지막 시청 위치 기반 이어보기
  - 영상 중간 O/X 퀴즈 (`analysis.quizzes`)
  - STT 세그먼트 자막 (`segments` -> WebVTT)
- 강사
  - 업로드 강좌 목록/상세/영상 페이지
  - `analysis.teacherGuides` 기반 난이도 구간/개선 제안 표시

## 기술 스택

- React 19, TypeScript 6, Vite 8
- Tailwind CSS 4 (`@tailwindcss/vite`)
- React Router 7
- Axios
- Vidstack Player (`@vidstack/react`, `vidstack`)
- ESLint 9 + typescript-eslint

## 빠른 시작 (로컬 개발)

### 1) 요구사항

- Node.js LTS (권장: 20+)
- npm

### 2) 설치 및 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 3) 환경변수

프로젝트 루트에 `.env` 파일을 만들고 아래 값을 설정합니다.

```env
VITE_API_BASE_URL=http://localhost:8080
```

> `VITE_` 접두사 변수는 **빌드 시점**에 번들에 주입됩니다.

## npm 스크립트

- `npm run dev`: 개발 서버 (HMR)
- `npm run build`: 타입 검사(`tsc -b`) + 프로덕션 빌드(`dist/`)
- `npm run preview`: 빌드 결과 미리보기
- `npm run lint`: ESLint

## 라우트 개요

`src/app/App.tsx`

- `/` : 홈
- `/mypage` : 학생 마이페이지
- `/lecture/:lectureClassId` : 학생 강좌 상세
- `/lecture/:lectureClassId/clip/:clipId/watch` : 학생 영상 시청
- `/teacher/lecture/:lectureId` : 강사 강좌 상세
- `/teacher/lecture/:lectureClassId/clip/:clipId` : 강사 영상 시청

## 프로젝트 구조

```text
src/
├─ app/        # 라우팅/앱 루트
├─ pages/      # 페이지
├─ widgets/    # 화면 위젯(UI)
├─ features/   # 도메인별 훅/매퍼/상태 처리
├─ entities/   # DTO/타입 모델
└─ shared/     # 공통(API, config, util)
```

### 플레이어 관련 주요 파일

- `src/widgets/student/StudentLectureVideoPlayer.tsx`
- `src/widgets/student/LecturePlaybackLogBridge.tsx`
- `src/widgets/student/LectureResumePlaybackBridge.tsx`
- `src/widgets/student/LectureQuizBridge.tsx`
- `src/shared/lib/segmentsToWebVtt.ts`

## API 연동 기준

- API 호출은 `src/shared/api/lectureApi.ts`로 집중
- DTO 타입은 `src/entities/lecture/types.ts`에서 관리
- 베이스 URL은 `src/shared/config/apiBaseUrl.ts`의 `VITE_API_BASE_URL` 사용

## Docker / 배포

### Dockerfile 참고

- builder: `node:22-alpine`에서 `npm run build`
- runner: `nginx:1.27-alpine`
- `ARG VITE_API_BASE_URL`를 빌드 시 주입
- `ARG NGINX_CONF`로 nginx 설정 파일 선택 가능

## GitHub Actions 배포 워크플로우

- 워크플로우 파일: `.github/workflows/deploy-frontend.yml`
- 트리거: `main`, `develop` push 및 수동 실행(`workflow_dispatch`)
- 이미지 빌드 시 `VITE_API_BASE_URL`은 GitHub Variables에서 주입

## 개발 규칙

- 코딩 규칙은 루트의 `frontend_rules.md`를 기준으로 합니다.
- PR 전 권장 체크
  - `npm run lint`
  - `npm run build`

## 참고

- 저장소의 텍스트 파일 줄바꿈 정책은 `.gitattributes` 기준(LF)입니다.
