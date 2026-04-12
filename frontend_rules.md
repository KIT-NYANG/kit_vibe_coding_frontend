# ⚛ Frontend Rules (React + TSX + DDD)

## 📌 역할 정의

이 프로젝트에서 프론트엔드는 React + TypeScript(TSX) 기반으로 작성한다.
모든 코드는 아래 규칙을 반드시 준수해야 한다.

---

# 1. 🏗 Architecture

다음 DDD 구조를 반드시 따른다:

```
src/
 ├── app/
 ├── shared/
 ├── entities/
 ├── features/
 ├── widgets/
 ├── pages/
```

## 규칙

* entities: 데이터 모델 및 타입 정의
* features: 비즈니스 로직 (hook 포함)
* widgets: UI 묶음
* pages: 화면 단위
* shared: 공통 모듈

---

# 2. 🏷 Naming Convention

## 필수 규칙

* 변수 / 함수 → camelCase
* 컴포넌트 → PascalCase
* 파일명:

  * 컴포넌트 → PascalCase.tsx
  * 나머지 → camelCase.ts

## 예시

```
UserCard.tsx
userApi.ts
useUserData.ts
```

---

# 3. 📁 File Rules

* 컴포넌트 파일: `.tsx`
* 로직 / API / hook: `.ts`

---

# 4. 🧠 Type Rules (필수)

## 규칙

* 모든 데이터는 타입 정의 필수
* any 타입 사용 금지
* 타입 없이 API 사용 금지

## 타입 위치

```
entities/{domain}/types.ts
```

## 예시

```ts
export interface User {
  id: number;
  name: string;
  role: "student" | "instructor";
}
```

---

# 5. 🧩 Component Rules

## 규칙

* 함수형 컴포넌트만 사용
* 화살표 함수 사용
* Props 타입 반드시 정의

## 예시

```tsx
interface UserCardProps {
  user: User;
}

const UserCard = ({ user }: UserCardProps) => {
  return <div>{user.name}</div>;
};
```

---

# 6. 🔗 API Rules (중요)

## 규칙

* API 호출은 반드시 `shared/api`에서만 수행
* 컴포넌트에서 직접 API 호출 금지

## 예시

```ts
export const fetchUsers = async (): Promise<User[]> => {
  const res = await axios.get("/api/v1/users");
  return res.data;
};
```

---

# 7. 🪝 Hook Rules

## 규칙

* 비즈니스 로직은 custom hook으로 분리
* hook에서 API 호출 수행

## 예시

```ts
const useUserData = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  return { users };
};
```

---

# 8. ⚖ UI / 로직 분리 (필수)

## 금지

* 컴포넌트에서 API 호출 금지
* 컴포넌트에서 비즈니스 로직 작성 금지

## 허용

* UI 렌더링만 수행

---

# 9. 📦 State Management

* 기본: useState, useEffect
* 전역 상태: Zustand 또는 Redux Toolkit

---

# 10. 🎨 Style Rules

* TailwindCSS 또는 CSS Module 사용
* 인라인 스타일 최소화

---

# 11. ⚠ Error Handling

* 모든 API는 try-catch 처리
* 사용자에게 에러 메시지 표시

---

# 12. 🚫 금지 사항 (강제)

* any 타입 사용 금지
* 컴포넌트에서 API 호출 금지
* UI에 비즈니스 로직 작성 금지
* 전역 상태 남용 금지
* 파일 300줄 초과 금지

---

# 13. 🧠 개발 원칙

다음 구조를 반드시 따른다:

* 데이터 → entities
* 로직 → features (hook)
* UI → pages / widgets

---

# 14. 🤖 AI 실행 규칙

AI는 반드시 아래를 따른다:

```
1. 이 문서의 모든 규칙을 준수한다
2. 컴포넌트에서는 API 호출을 하지 않는다
3. 모든 데이터는 타입을 정의한다
4. any 타입을 사용하지 않는다
5. 비즈니스 로직은 hook으로 분리한다
6. camelCase 규칙을 준수한다
```