import { useEffect, useState } from 'react';
import { useRentalStore } from '../stores/rentalStore';

/**
 * 옵저버 패턴 (Observer Pattern)
 * 대여 상태 변경을 구독하고 자동으로 컴포넌트를 업데이트합니다.
 *
 * Subject: useRentalStore (대여 상태 관리)
 * Observers: 이 훅을 사용하는 모든 컴포넌트들
 *
 * 동작 방식:
 * 1. 컴포넌트가 마운트될 때 옵저버로 등록
 * 2. 대여 상태가 변경되면 Subject가 모든 옵저버에게 알림
 * 3. 옵저버는 자동으로 re-render되어 최신 상태 반영
 * 4. 컴포넌트가 언마운트될 때 옵저버 구독 해제
 *
 * @returns {object} 대여 상태와 마지막 업데이트 시간
 */
export const useRentalObserver = () => {
  const { rentals, lastUpdate, subscribe } = useRentalStore();
  const [updateCount, setUpdateCount] = useState(0);

  useEffect(() => {
    // 옵저버 등록: 대여 상태 변경 시 호출될 콜백 함수
    const unsubscribe = subscribe(() => {
      setUpdateCount((prev) => prev + 1);
      console.log('🔔 [옵저버 패턴] 대여 상태가 변경되었습니다.');
    });

    // 컴포넌트 언마운트 시 옵저버 구독 해제
    return () => {
      unsubscribe();
    };
  }, [subscribe]);

  return {
    rentals,
    lastUpdate,
    updateCount,
  };
};

/**
 * 대시보드 통계용 옵저버 훅
 * 대여 상태 변경 시 대시보드 통계를 자동으로 업데이트합니다.
 */
export const useDashboardObserver = () => {
  const { rentals, subscribe } = useRentalStore();
  const [stats, setStats] = useState({
    ongoingCount: 0,
    completedCount: 0,
    overdueCount: 0,
  });

  // 통계 계산 함수
  const calculateStats = () => {
    const ongoingCount = rentals.filter((r) => r.status === 'ONGOING').length;
    const completedCount = rentals.filter((r) => r.status === 'COMPLETED').length;
    const overdueCount = rentals.filter((r) => r.status === 'OVERDUE').length;

    setStats({ ongoingCount, completedCount, overdueCount });
  };

  useEffect(() => {
    // 초기 통계 계산
    calculateStats();

    // 옵저버 등록: 대여 상태 변경 시 통계 재계산
    const unsubscribe = subscribe(() => {
      console.log('📊 [옵저버 패턴] 대시보드 통계가 업데이트되었습니다.');
      calculateStats();
    });

    return () => {
      unsubscribe();
    };
  }, [rentals, subscribe]);

  return stats;
};

/**
 * 알림용 옵저버 훅
 * 대여 상태 변경 시 토스트 알림을 표시합니다.
 */
export const useNotificationObserver = (
  onNotification: (message: string) => void
) => {
  const { subscribe } = useRentalStore();

  useEffect(() => {
    // 옵저버 등록: 대여 상태 변경 시 알림
    const unsubscribe = subscribe(() => {
      console.log('🔔 [옵저버 패턴] 알림 컴포넌트에 상태 변경 알림');
      onNotification('대여 상태가 변경되었습니다.');
    });

    return () => {
      unsubscribe();
    };
  }, [subscribe, onNotification]);
};
