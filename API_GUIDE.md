# 단국대 디자인패턴 4조 - 편의물품 대여 시스템 API 가이드

## 📋 목차
1. [백엔드 API 전체 목록](#1-백엔드-api-전체-목록)
2. [페이지별 구성 및 API 연결](#2-페이지별-구성-및-api-연결)
3. [디자인 패턴 구현 위치](#3-디자인-패턴-구현-위치)
4. [기능 설명](#4-기능-설명)

---

## 1. 백엔드 API 전체 목록

### 🔵 대여 관련 API (6개)

| API | 설명 | 사용 화면 |
|-----|------|----------|
| `GET /api/rentals` | 전체 대여 기록 가져오기 | 대시보드, 대여관리 |
| `GET /api/rentals?status=OVERDUE` | 연체된 대여만 가져오기 | 대여관리 (연체 필터) |
| `POST /api/rentals` | 새로운 대여 등록하기 | 대여관리 |
| `POST /api/rentals/{id}/return` | 대여 물품 반납하기 | 대여관리 |
| `PUT /api/rentals/{id}` | 대여 정보 수정하기 | (예비용) |
| `DELETE /api/rentals/{id}` | 대여 기록 삭제하기 | 대여관리 |

### 🟢 물품 관련 API (6개)

| API | 설명 | 사용 화면 |
|-----|------|----------|
| `GET /api/items` | 전체 물품 목록 가져오기 | 대시보드, 대여관리, 물품관리 |
| `GET /api/items/{id}` | 특정 물품 상세정보 가져오기 | (예비용) |
| `POST /api/items` | 새로운 물품 등록하기 | 물품관리 |
| `PUT /api/items/{id}` | 물품 정보 수정하기 | 물품관리 |
| `PATCH /api/items/{id}` | 물품 정보 일부만 수정하기 | (예비용) |
| `DELETE /api/items/{id}` | 물품 삭제하기 | 물품관리 |

**총 12개 API** 사용 중

---

## 2. 페이지별 구성 및 API 연결

### 🏠 대시보드 페이지 (`/dashboard`)

#### 페이지에서 보이는 것
```
┌─────────────────────────────────────────────┐
│  대시보드                                    │
│  2025 단국대 디자인패턴 4조                  │
└─────────────────────────────────────────────┘

┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ 현재     │ │ 대여가능 │ │ 오늘의   │ │ 연체 중  │
│ 대여 중  │ │ 물품     │ │ 대여     │ │          │
│   5      │ │   12     │ │   3      │ │   1      │
└──────────┘ └──────────┘ └──────────┘ └──────────┘

┌─────────────────────────────────────────────┐
│  빠른 액션                                   │
│  [물품 대여] [물품 등록] [연체 목록]         │
└─────────────────────────────────────────────┘

┌──────────────────┐  ┌──────────────────┐
│  최근 활동        │  │  인기 물품 Top 5  │
│  • 대여: 노트북   │  │  1. 노트북 (15회)│
│  • 반납: 우산     │  │  2. 충전기 (12회)│
│  • 대여: 충전기   │  │  3. 우산 (8회)   │
└──────────────────┘  └──────────────────┘
```

#### 연결된 API
1. **`GET /api/rentals`** ← 페이지 열자마자 자동 호출
   - 통계 카드 4개에 데이터 제공
   - 최근 활동 목록에 표시
   - 인기 물품 순위 계산

2. **`GET /api/items`** ← 페이지 열자마자 자동 호출
   - "대여 가능 물품" 통계 계산

#### 코드 위치
- 파일: `src/pages/Dashboard.tsx`
- 컴포넌트: `StatCard`, `QuickActions`, `RecentActivity`, `PopularItems`

---

### 📦 대여/반납 관리 페이지 (`/rentals`)

#### 페이지에서 보이는 것
```
┌─────────────────────────────────────────────┐
│  대여/반납 관리                              │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  물품 대여                                   │
│  ┌─────────────────────────────────────┐    │
│  │ 물품 선택: [노트북 ▼]               │    │
│  │ 대여자 이름: [홍길동]               │    │
│  │ 연락처: [010-1234-5678]             │    │
│  │ 반납 예정일: [2025-10-25]           │    │
│  │ 비고: [조심히 사용하겠습니다]       │    │
│  │          [대여 등록]                 │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  대여 기록                                   │
│  [검색창] [상태 필터: 전체▼]                │
│  ※ 연체 목록 버튼 클릭 시: [상태: 연체▼]   │
│                                              │
│  ┌─────────────────────────────────────┐   │
│  │ 🖥️ 노트북        [대여중]           │   │
│  │ 대여자: 홍길동 (010-1234-5678)      │   │
│  │ 대여일: 2025-10-20                  │   │
│  │ 반납예정: 2025-10-25                │   │
│  │                        [반납] [수정] │   │
│  └─────────────────────────────────────┘   │
│                                              │
│  ┌─────────────────────────────────────┐   │
│  │ ☂️ 우산          [반납완료]         │   │
│  │ 대여자: 김철수 (010-9876-5432)      │   │
│  │ 대여일: 2025-10-18                  │   │
│  │ 반납일: 2025-10-20                  │   │
│  │                              [삭제]  │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

#### 연결된 API

**페이지 열자마자 자동 호출:**
1. **`GET /api/rentals`** 또는 **`GET /api/rentals?status=OVERDUE`**
   - 대여 기록 목록 표시
   - 검색/필터 기능에 사용

2. **`GET /api/items`**
   - 물품 선택 드롭다운에 표시
   - 대여 가능한 물품만 보여줌

**사용자가 버튼 클릭할 때:**
3. **`POST /api/rentals`** ← "대여 등록" 버튼
   - 요청 데이터 예시:
   ```json
   {
     "itemId": 1,
     "renterName": "홍길동",
     "renterContact": "010-1234-5678",
     "expectedReturnDate": "2025-10-25T00:00:00.000Z",
     "notes": "조심히 사용하겠습니다"
   }
   ```

4. **`POST /api/rentals/{id}/return`** ← "반납" 버튼
   - 대여 중인 물품만 반납 가능

5. **`DELETE /api/rentals/{id}`** ← "삭제" 버튼
   - 반납 완료된 기록만 삭제 가능

#### 코드 위치
- 파일: `src/pages/Rentals.tsx`
- 컴포넌트:
  - `RentalForm` - 대여 등록 폼
  - `RentalList` - 대여 기록 목록 및 필터 (URL 파라미터 읽어서 자동 필터 선택)
  - `RentalItem` - 개별 대여 항목 카드

---

### 🎒 물품 관리 페이지 (`/items`)

#### 페이지에서 보이는 것
```
┌─────────────────────────────────────────────┐
│  물품 관리                   [+ 물품 등록]   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  [카테고리: 전체▼] [대여가능: 전체▼]        │
│  총 15개의 물품                              │
└─────────────────────────────────────────────┘

┌────────┐  ┌────────┐  ┌────────┐
│🖥️      │  │🔌      │  │☂️      │
│노트북   │  │충전기   │  │우산     │
│전자기기 │  │전자기기 │  │생활용품 │
│        │  │        │  │        │
│재고: ███│  │재고: ███│  │재고: ███│
│  3/5   │  │ 10/15  │  │  5/10  │
│        │  │        │  │        │
│[대여가능]│  │[대여가능]│  │[재고부족]│
│[수정][삭제]│ │[수정][삭제]│ │[수정][삭제]│
└────────┘  └────────┘  └────────┘
```

#### 연결된 API

**페이지 열자마자 자동 호출:**
1. **`GET /api/items`**
   - 물품 카드들 표시
   - 재고 현황 프로그레스 바
   - 대여가능 여부 배지

**사용자가 버튼 클릭할 때:**

2. **`POST /api/items`** ← "물품 등록" 버튼
   - 모달창이 열림
   - 요청 데이터 예시:
   ```json
   {
     "name": "노트북",
     "category": "전자기기",
     "description": "MacBook Pro 13인치",
     "stock": 5
   }
   ```

3. **`PUT /api/items/{id}`** ← "수정" 버튼
   - 물품 카드의 수정 버튼
   - 모달창에서 정보 수정

4. **`DELETE /api/items/{id}`** ← "삭제" 버튼
   - 물품 카드의 삭제 버튼

#### 모달 예시
```
┌─────────────────────────────┐
│  물품 등록              [X]  │
├─────────────────────────────┤
│  물품명 *                    │
│  [노트북_______________]     │
│                              │
│  카테고리 *                  │
│  [전자기기_____________]     │
│                              │
│  설명 *                      │
│  [MacBook Pro 13인치    ]    │
│  [_____________________ ]    │
│                              │
│  재고 수량 *                 │
│  [5____]                     │
│                              │
│      [취소]      [등록]      │
└─────────────────────────────┘
```

#### 코드 위치
- 파일: `src/pages/Items.tsx`
- 컴포넌트: `ItemGrid`, `ItemCard`, `ItemForm`

---

## 3. 디자인 패턴 구현 위치

### 🎯 전략 패턴 (Strategy Pattern)

**어디에 있나요?**
- 파일: `src/services/apiStrategies.ts`

**무엇을 하나요?**
- 12개 API를 각각 독립적인 클래스로 만들어서 관리
- API 호출 방식을 쉽게 바꿀 수 있게 함

**코드 구조:**
```typescript
// 전략 인터페이스
interface RentalApiStrategy {
  execute(...args): Promise<any>;
}

// 구체적인 전략 (대여 목록 조회)
class GetRentalsStrategy implements RentalApiStrategy {
  async execute(status?) {
    return await api.get('/rentals', { params: { status } });
  }
}

// 전략을 사용하는 서비스
export class RentalApiService {
  private getRentalsStrategy = new GetRentalsStrategy();

  async getRentals(status?) {
    return this.getRentalsStrategy.execute(status);
  }
}
```

**왜 이렇게 만들었나요?**
- ✅ API 호출 로직을 교체하기 쉬움
- ✅ 새로운 API 추가할 때 기존 코드 안 건드려도 됨
- ✅ 각 API를 독립적으로 테스트 가능

**실제 사용 예시:**
```typescript
// src/hooks/useRentals.ts
const data = await rentalApiService.getRentals(); // 전략 패턴 사용!
```

---

### 🔔 옵저버 패턴 (Observer Pattern)

**어디에 있나요?**
- Subject (주체): `src/stores/rentalStore.ts`
- Observer (관찰자): `src/hooks/useRentalObserver.ts`

**무엇을 하나요?**
- 대여 데이터가 변경되면 자동으로 화면 여러 곳이 동시에 업데이트됨

**코드 구조:**
```typescript
// Subject (주체) - rentalStore.ts
export const useRentalStore = create((set, get) => ({
  rentals: [],
  observers: [],

  // 대여 추가 시
  addRental: (rental) => {
    set({ rentals: [...rentals, rental] });
    get().notifyObservers(); // 모든 관찰자에게 알림!
  },

  // 관찰자 등록
  subscribe: (observer) => {
    set({ observers: [...observers, observer] });
    return () => { /* 구독 해제 */ };
  },

  // 모든 관찰자에게 알림
  notifyObservers: () => {
    observers.forEach(obs => obs());
  }
}));

// Observer (관찰자) - useRentalObserver.ts
export const useRentalObserver = () => {
  const { rentals, subscribe } = useRentalStore();

  useEffect(() => {
    // 구독 시작
    const unsubscribe = subscribe(() => {
      console.log('대여 상태가 변경되었어요!');
      // 화면 자동 갱신
    });

    // 컴포넌트 종료 시 구독 해제
    return () => unsubscribe();
  }, []);

  return { rentals };
};
```

**어떻게 동작하나요?**
```
1. 사용자가 "대여 등록" 버튼 클릭
   ↓
2. POST /api/rentals 호출
   ↓
3. 성공하면 rentalStore.addRental() 실행
   ↓
4. notifyObservers() 호출
   ↓
5. 구독 중인 모든 컴포넌트가 자동 갱신!
   - 대시보드 통계 카드 숫자 변경
   - 대여 목록 새로고침
   - 최근 활동 업데이트
```

**왜 이렇게 만들었나요?**
- ✅ 데이터 변경 시 관련된 모든 화면이 자동으로 동기화됨
- ✅ 각 컴포넌트가 독립적으로 동작 (느슨한 결합)
- ✅ 메모리 누수 방지 (자동 구독 해제)

---

### 🎨 데코레이터 패턴 (Decorator Pattern)

**어디에 있나요?**
- 파일: `src/components/decorators/`
  - `withLoading.tsx` - 로딩 화면 추가
  - `withErrorBoundary.tsx` - 에러 처리 추가
  - `withLogger.tsx` - 로그 기록 추가

**무엇을 하나요?**
- 기존 컴포넌트를 감싸서 추가 기능을 붙여줌
- 원본 코드는 전혀 수정하지 않음

**코드 구조:**
```typescript
// withErrorBoundary.tsx
export function withErrorBoundary(Component, errorMessage) {
  return (props) => (
    <ErrorBoundary fallbackMessage={errorMessage}>
      <Component {...props} />
    </ErrorBoundary>
  );
}

// withLogger.tsx
export function withLogger(Component, componentName) {
  return (props) => {
    useEffect(() => {
      console.log(`${componentName} 시작!`);
      return () => {
        console.log(`${componentName} 종료!`);
      };
    }, []);

    return <Component {...props} />;
  };
}
```

**실제 사용 예시:**
```typescript
// Dashboard.tsx
const DashboardContent = () => {
  // 대시보드 내용
};

// 여러 데코레이터를 겹겹이 감싸기
const Dashboard = withLogger(
  withErrorBoundary(
    DashboardContent,
    '대시보드 로딩 중 에러 발생!'
  ),
  'Dashboard'
);

export default Dashboard;
```

**데코레이터 적용 현황:**

| 페이지 | withLogger | withErrorBoundary |
|--------|-----------|-------------------|
| Dashboard | ✅ | ✅ |
| Rentals | ✅ | ✅ |
| Items | ✅ | ✅ |

**왜 이렇게 만들었나요?**
- ✅ 원본 컴포넌트 코드 수정 없이 기능 추가
- ✅ 로깅, 에러처리 같은 공통 기능을 재사용
- ✅ 여러 데코레이터를 자유롭게 조합 가능

---

## 4. 기능 설명

### 📊 대시보드 주요 기능

**1. 실시간 통계 카드**
- API: `GET /api/rentals`, `GET /api/items`
- 기능: 현재 대여/가능/오늘/연체 통계 표시
- 옵저버 패턴으로 자동 갱신

**2. 빠른 액션**
- 물품 대여: `/rentals` 페이지로 이동
- 물품 등록: `/items` 페이지로 이동
- 연체 목록: `/rentals?filter=overdue` 페이지로 이동 + **필터 드롭다운 자동 "연체" 선택**

**3. 최근 활동**
- API: `GET /api/rentals`
- 기능: 최근 대여/반납 10건 표시

**4. 인기 물품 Top 5**
- API: `GET /api/rentals`
- 기능: 대여 빈도 순으로 인기 물품 집계

---

### 📦 대여 관리 주요 기능

**1. 물품 대여 등록**
- API: `POST /api/rentals`
- 필수 입력:
  - 물품 선택 (드롭다운)
  - 대여자 이름
  - 연락처
  - 반납 예정일
- 선택 입력: 비고
- 폼 유효성 검사 포함

**2. 대여 기록 조회**
- API: `GET /api/rentals` 또는 `GET /api/rentals?status=OVERDUE`
- 기능:
  - 검색: 물품명, 대여자 이름 (클라이언트 측)
  - 필터: 전체/대여중/완료/연체 (서버 측)
  - 페이지네이션: 5건씩
  - **URL 파라미터 연동**: `/rentals?filter=overdue`로 접근 시 필터 드롭다운 자동으로 "연체" 선택됨

**3. 물품 반납**
- API: `POST /api/rentals/{id}/return`
- 조건: 대여 중 상태만 가능
- 확인 메시지 표시

**4. 기록 삭제**
- API: `DELETE /api/rentals/{id}`
- 조건: 반납 완료 상태만 가능
- 확인 메시지 표시

**5. 연체 강조 표시**
- 연체된 항목은 빨간색 테두리로 강조

---

### 🎒 물품 관리 주요 기능

**1. 물품 목록 조회**
- API: `GET /api/items`
- 그리드 레이아웃으로 표시
- 재고 프로그레스 바

**2. 물품 등록**
- API: `POST /api/items`
- 모달창으로 입력
- 필수 입력: 물품명, 카테고리, 설명, 재고

**3. 물품 수정**
- API: `PUT /api/items/{id}`
- 모달창으로 수정
- 기존 정보 자동 채워짐

**4. 물품 삭제**
- API: `DELETE /api/items/{id}`
- 확인 메시지 표시

**5. 필터링**
- 카테고리별 필터 (클라이언트 측)
- 대여가능 여부 필터 (클라이언트 측)

**6. 재고 상태 표시**
- 재고없음: 회색 처리
- 재고부족: 노란색 배지 (재고 20% 이하)
- 대여가능: 초록색 배지
- 대여불가: 빨간색 배지

---

## 5. API 호출 흐름

### 조회 (GET)
```
1. 페이지 열림
   ↓
2. React Query Hook 실행
   ↓
3. 전략 패턴으로 API 호출
   ↓
4. Axios로 HTTP GET 요청
   ↓
5. 응답 데이터를 React Query 캐시에 저장
   ↓
6. Zustand Store 업데이트
   ↓
7. 옵저버 패턴으로 구독 중인 컴포넌트들 갱신
   ↓
8. 화면에 데이터 표시
```

### 생성/수정/삭제 (POST/PUT/DELETE)
```
1. 사용자 버튼 클릭
   ↓
2. React Query Mutation 실행
   ↓
3. 전략 패턴으로 API 호출
   ↓
4. Axios로 HTTP POST/PUT/DELETE 요청
   ↓
5. 성공 시:
   - React Query 캐시 무효화 (자동 refetch)
   - Zustand Store 업데이트
   - 옵저버들에게 알림
   - 관련 컴포넌트 자동 갱신
   ↓
6. 실패 시:
   - ErrorBoundary가 에러 UI 표시
```

---

## 6. 파일 구조

```
src/
├── pages/                    ← 페이지 컴포넌트
│   ├── Dashboard.tsx         (대시보드)
│   ├── Rentals.tsx           (대여 관리)
│   └── Items.tsx             (물품 관리)
│
├── services/                 ← 🎯 전략 패턴
│   ├── api.ts                (Axios 설정)
│   └── apiStrategies.ts      (API 전략 클래스)
│
├── stores/                   ← 🔔 옵저버 패턴 (Subject)
│   └── rentalStore.ts        (Zustand)
│
├── hooks/                    ← 🔔 옵저버 패턴 (Observer)
│   ├── useRentalObserver.ts  (옵저버 훅)
│   ├── useRentals.ts         (대여 React Query)
│   └── useItems.ts           (물품 React Query)
│
├── components/
│   ├── decorators/           ← 🎨 데코레이터 패턴
│   │   ├── withLoading.tsx
│   │   ├── withErrorBoundary.tsx
│   │   └── withLogger.tsx
│   │
│   ├── common/               ← 공통 컴포넌트
│   ├── dashboard/            ← 대시보드 컴포넌트
│   ├── rentals/              ← 대여 컴포넌트
│   └── items/                ← 물품 컴포넌트
│
└── types/                    ← TypeScript 타입
    └── index.ts
```

---

## 7. 테스트 방법

### Postman으로 API 테스트

**1. 물품 목록 조회**
```
GET https://designpattern.ellen24k.r-e.kr/api/items
```

**2. 대여 목록 조회**
```
GET https://designpattern.ellen24k.r-e.kr/api/rentals
```

**3. 물품 등록**
```
POST https://designpattern.ellen24k.r-e.kr/api/items
Content-Type: application/json

{
  "name": "노트북",
  "category": "전자기기",
  "description": "MacBook Pro",
  "stock": 5
}
```

**4. 대여 등록**
```
POST https://designpattern.ellen24k.r-e.kr/api/rentals
Content-Type: application/json

{
  "itemId": 1,
  "renterName": "홍길동",
  "renterContact": "01012345678",
  "expectedReturnDate": "2025-10-25T00:00:00.000Z",
  "notes": "테스트"
}
```

### 브라우저에서 API 확인

**F12 → Network 탭**
1. 페이지 새로고침
2. `rentals`, `items` 요청 확인
3. Response 탭에서 데이터 확인

**F12 → Console 탭**
- 옵저버 패턴 로그 확인
- API 호출 로그 확인

---

## 8. 요약

### 사용된 API
- **대여 API**: 6개
- **물품 API**: 6개
- **총**: 12개

### 화면 구성
- **대시보드**: 통계, 빠른액션, 최근활동, 인기물품
- **대여관리**: 대여등록, 목록조회, 반납, 삭제
- **물품관리**: 등록, 수정, 삭제, 필터링

### 디자인 패턴
- **전략 패턴**: API 호출 로직 분리 (`apiStrategies.ts`)
- **옵저버 패턴**: 상태 변경 자동 동기화 (`rentalStore.ts`, `useRentalObserver.ts`)
- **데코레이터 패턴**: 로깅, 에러처리 기능 추가 (`decorators/`)

---

© 2025 단국대 디자인패턴 4조
