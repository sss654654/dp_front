/**
 * 대시보드 페이지
 *
 * 디자인 패턴 적용:
 * 1. 옵저버 패턴: useRentalObserver를 통해 대여 상태 변경 자동 감지
 * 2. 데코레이터 패턴: withLoading, withErrorBoundary로 기능 확장
 */

import React from 'react';
import { Package, ShoppingCart, AlertCircle, CheckCircle } from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { QuickActions } from '../components/dashboard/QuickActions';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { PopularItems } from '../components/dashboard/PopularItems';
import { useRentals } from '../hooks/useRentals';
import { useItems } from '../hooks/useItems';
import { useRentalObserver } from '../hooks/useRentalObserver';
import { withErrorBoundary } from '../components/decorators/withErrorBoundary';
import { withLogger } from '../components/decorators/withLogger';
import { Loader2 } from 'lucide-react';

const DashboardContent: React.FC = () => {
  // 옵저버 패턴: 대여 상태 변경 감지
  const { rentals } = useRentalObserver();

  const { data: allRentals = [], isLoading: isLoadingRentals } = useRentals();
  const { data: items = [], isLoading: isLoadingItems } = useItems();

  // 로딩 상태 처리
  if (isLoadingRentals || isLoadingItems) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8F9FA]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-gray-600 font-medium mt-4">로딩 중...</p>
      </div>
    );
  }

  // 통계 계산
  const ongoingCount = rentals.filter((r) => r.status === 'ONGOING').length;
  const availableCount = items.filter((i) => i.available && i.stock > 0).length;
  const overdueCount = rentals.filter((r) => r.status === 'OVERDUE').length;

  // 오늘의 대여 건수
  const today = new Date().toDateString();
  const todayRentals = rentals.filter(
    (r) => new Date(r.rentalDate).toDateString() === today
  ).length;

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">대시보드</h1>
        <p className="text-gray-600">2025 단국대 디자인패턴 4조 - 편의물품 대여 시스템</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="현재 대여 중" value={ongoingCount} icon={ShoppingCart} color="blue" />
        <StatCard title="대여 가능 물품" value={availableCount} icon={Package} color="green" />
        <StatCard title="오늘의 대여" value={todayRentals} icon={CheckCircle} color="yellow" />
        <StatCard title="연체 중" value={overdueCount} icon={AlertCircle} color="red" />
      </div>

      {/* 빠른 액션 */}
      <div className="mb-8">
        <QuickActions />
      </div>

      {/* 하단 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity rentals={allRentals} />
        <PopularItems rentals={allRentals} />
      </div>
    </div>
  );
};

// 데코레이터 패턴: 에러 처리, 로깅 기능 추가
const Dashboard = withLogger(
  withErrorBoundary(
    DashboardContent,
    '대시보드를 불러오는 중 문제가 발생했습니다.'
  ),
  'Dashboard'
);

export default Dashboard;
