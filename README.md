# kit_vibe_coding_frontend

Vite로 구축한 **React + TypeScript** 프론트엔드 저장소입니다.  
DDD 스타일 폴더 구조와 `frontend_rules.md`에 정의된 코딩 규칙을 따릅니다.

---

## 팀원 온보딩 (빠른 시작)

1. **필수 환경**: [Node.js](https://nodejs.org/) LTS 권장 (npm 포함)
2. 저장소 클론 후 프로젝트 루트에서:
   ```bash
   npm install
   npm run dev
   ```
3. 브라우저에서 안내된 로컬 주소(기본 `http://localhost:5173`)로 접속합니다.
4. 기능을 추가·수정할 때는 **`frontend_rules.md`**를 반드시 확인합니다.

---

## 기술 스택

| 구분 | 사용 |
|------|------|
| UI | React 19 |
| 언어 | TypeScript 6 |
| 빌드·번들 | Vite 8 |
| 스타일 | Tailwind CSS 4 (`@tailwindcss/vite`) |
| 린트 | ESLint 9 + typescript-eslint |

---

## npm 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 (HMR) |
| `npm run build` | 타입 검사(`tsc`) 후 프로덕션 빌드 (`dist/`) |
| `npm run preview` | 빌드 결과 로컬 미리보기 |
| `npm run lint` | ESLint 실행 |

---

## 소스 구조 (개요)

`frontend_rules.md`의 DDD 레이어와 동일합니다.

```
src/
├── app/           # 앱 루트 조합 (예: App.tsx)
├── pages/         # 페이지 단위
├── widgets/       # UI 묶음
├── features/      # 비즈니스 로직·커스텀 훅
├── entities/      # 도메인 타입·모델 (예: entities/{domain}/types.ts)
└── shared/        # 공통 모듈 (API는 shared/api에서만)
```

- **엔트리**: `src/main.tsx` → `app/App.tsx` → `pages/HomePage.tsx`
- **API 호출**: `shared/api/client.ts`를 참고해 `shared/api`에만 두고, 컴포넌트에서 직접 호출하지 않습니다.

---

## 개발 규칙

- 상세 규칙(네이밍, 타입, 컴포넌트·훅·API 분리, 상태 관리 등)은 저장소 루트의 **`frontend_rules.md`**를 기준으로 합니다.
- PR 전에 `npm run lint`와 `npm run build`가 통과하는지 확인하는 것을 권장합니다.

---

## Git · 줄바꿈

저장소 루트의 **`.gitattributes`**에서 주요 텍스트 파일을 **LF**로 맞춰 두었습니다. 클론 후에도 동일한 정책이 적용됩니다. Windows에서 예전에 보이던 `LF`/`CRLF` 관련 경고는 이후 커밋부터 줄어드는 경우가 많습니다.
