# 단국대학교 편의물품 대여 시스템 프론트엔드

React + TypeScript로 구현된 단국대학교 편의물품 대여 관리 시스템입니다.

## 🛠 기술 스택

- **React 18.2** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **React Router v6** - 라우팅
- **Axios** - HTTP 클라이언트
- **React Query (TanStack Query)** - 서버 상태 관리
- **Zustand** - 클라이언트 상태 관리
- **Tailwind CSS** - 스타일링
- **Lucide React** - 아이콘
- **Vite** - 빌드 도구

## 🎨 디자인 패턴

### 1. 전략 패턴 (Strategy Pattern)
- **위치**: `src/services/apiStrategies.ts`
- **목적**: API 호출 방식을 캡슐화하여 교체 가능하게 만듦
- **구현**: RentalApiService, ItemApiService
- **장점**: 코드의 유연성과 확장성 향상

### 2. 옵저버 패턴 (Observer Pattern)
- **위치**: `src/hooks/useRentalObserver.ts`, `src/stores/rentalStore.ts`
- **목적**: 대여 상태 변경 시 관련 컴포넌트에 자동 알림
- **Subject**: Zustand 스토어
- **Observers**: 대시보드 통계, 대여 목록, 알림 컴포넌트
- **장점**: 상태 변경 자동 감지 및 UI 업데이트

### 3. 데코레이터 패턴 (Decorator Pattern)
- **위치**: `src/components/decorators/`
- **구현**:
  - `withLoading.tsx` - 로딩 상태 표시
  - `withErrorBoundary.tsx` - 에러 처리
  - `withLogger.tsx` - 로깅 기능
- **장점**: 기존 컴포넌트 수정 없이 기능 추가

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── common/           # 공통 컴포넌트 (Card, Button, Modal)
│   ├── dashboard/        # 대시보드 컴포넌트
│   ├── rentals/          # 대여 관리 컴포넌트
│   ├── items/            # 물품 관리 컴포넌트
│   └── decorators/       # 데코레이터 패턴 HOC
├── services/
│   ├── apiStrategies.ts  # 전략 패턴 API 서비스
│   └── api.ts            # Axios 인스턴스
├── hooks/
│   ├── useRentalObserver.ts  # 옵저버 패턴 훅
│   ├── useRentals.ts     # 대여 관련 React Query 훅
│   └── useItems.ts       # 물품 관련 React Query 훅
├── stores/
│   └── rentalStore.ts    # Zustand 상태 관리
├── types/
│   └── index.ts          # TypeScript 타입 정의
├── pages/
│   ├── Dashboard.tsx     # 대시보드 페이지
│   ├── Rentals.tsx       # 대여/반납 관리 페이지
│   └── Items.tsx         # 물품 관리 페이지
├── App.tsx
└── main.tsx
```

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

개발 서버가 http://localhost:3000 에서 실행됩니다.

### 3. 백엔드 서버 설정

백엔드 API 서버가 http://localhost:8080 에서 실행되어야 합니다.

API 베이스 URL을 변경하려면 `src/services/api.ts` 파일의 `baseURL`을 수정하세요.

## 📄 주요 기능

### 대시보드 (`/dashboard`)
- 실시간 현황 카드 4개
  - 현재 대여 중인 물품 수
  - 대여 가능한 물품 수
  - 오늘의 대여 건수
  - 연체 중인 대여 건수
- 빠른 액션 버튼 (물품 대여, 물품 등록, 연체 목록)
- 최근 활동 타임라인
- 인기 물품 순위 Top 5

### 대여/반납 관리 (`/rentals`)
- 물품 대여 등록
  - 대여자 정보 입력
  - 물품 선택
  - 반납 예정일 설정
  - 비고 입력
- 대여 기록 조회
  - 상태별 필터링 (대여중/완료/연체)
  - 검색 기능
  - 페이지네이션
- 물품 반납 처리
- 대여 기록 삭제 (완료된 기록만)

### 물품 관리 (`/items`)
- 물품 등록/수정/삭제
- 물품 목록 조회
  - 카테고리별 필터
  - 대여가능 여부 필터
  - 그리드 뷰
- 재고 현황 표시
- 대여 불가 물품 회색 처리

## 🎨 UI/UX 디자인

### 색상 테마 (단국대학교 스타일)
- **Primary**: #003876 (단국대 블루)
- **Secondary**: #E8112D (단국대 레드)
- **Background**: #F8F9FA
- **Card**: #FFFFFF
- **Text**: #212529
- **Border**: #DEE2E6

### 디자인 특징
- 카드형 디자인 (그림자 효과)
- 둥근 모서리 (rounded-lg)
- 반응형 그리드 레이아웃
- 호버 효과 (transition-all)
- 아이콘 사용 (lucide-react)

## 🔧 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

## 📝 API 엔드포인트

### 대여 관리 API
- `GET /api/rentals` - 대여 기록 조회
- `POST /api/rentals` - 품목 대여
- `PUT /api/rentals/{id}` - 대여 정보 수정
- `DELETE /api/rentals/{id}` - 대여 기록 삭제
- `PATCH /api/rentals/{id}` - 대여 정보 부분 수정
- `POST /api/rentals/{id}/return` - 품목 반납

### 물품 관리 API
- `GET /api/items` - 품목 목록 조회
- `POST /api/items` - 품목 등록
- `GET /api/items/{id}` - 품목 상세 조회
- `PUT /api/items/{id}` - 품목 정보 수정
- `DELETE /api/items/{id}` - 품목 삭제
- `PATCH /api/items/{id}` - 품목 정보 부분 수정

## 📚 디자인 패턴 상세 설명

### 전략 패턴 예시
```typescript
// API 호출 로직을 전략 객체로 분리
const rentalApiService = new RentalApiService();
const rentals = await rentalApiService.getRentals();
```

### 옵저버 패턴 예시
```typescript
// 대여 상태 변경 시 자동으로 컴포넌트 업데이트
const { rentals, updateCount } = useRentalObserver();
```

### 데코레이터 패턴 예시
```typescript
// 여러 데코레이터 조합하여 기능 추가
const Dashboard = withLogger(
  withErrorBoundary(
    withLoading(DashboardContent)
  )
);
```

## 🤝 기여

버그 리포트 및 개선 제안은 이슈로 등록해주세요.

## 📄 라이선스

MIT License

---

© 2025 단국대 디자인패턴 4조
