/**
 * 대여/반납 관리 페이지
 *
 * 디자인 패턴 적용:
 * 1. 전략 패턴: rentalApiService를 통한 API 호출
 * 2. 옵저버 패턴: 대여 상태 변경 시 자동 갱신
 * 3. 데코레이터 패턴: withLoading, withErrorBoundary로 기능 확장
 */

import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { RentalList } from '../components/rentals/RentalList';
import { RentalForm } from '../components/rentals/RentalForm';
import { useRentals, useCreateRental, useReturnRental, useDeleteRental } from '../hooks/useRentals';
import { useItems } from '../hooks/useItems';
import { withErrorBoundary } from '../components/decorators/withErrorBoundary';
import { withLogger } from '../components/decorators/withLogger';
import { RentalStatus } from '../types';

const RentalsContent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter');

  // 필터에 따라 상태 설정
  let statusFilter: RentalStatus | undefined;
  if (filter === 'overdue') statusFilter = 'OVERDUE';

  const { data: rentals = [], isLoading: isLoadingRentals } = useRentals(statusFilter);
  const { data: items = [], isLoading: isLoadingItems } = useItems();
  const createRentalMutation = useCreateRental();
  const returnRentalMutation = useReturnRental();
  const deleteRentalMutation = useDeleteRental();

  const [returningId, setReturningId] = useState<number | undefined>();
  const [deletingId, setDeletingId] = useState<number | undefined>();

  // 로딩 상태 처리
  if (isLoadingRentals || isLoadingItems) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8F9FA]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-gray-600 font-medium mt-4">로딩 중...</p>
      </div>
    );
  }

  const handleCreateRental = async (data: any) => {
    try {
      await createRentalMutation.mutateAsync(data);
      alert('대여가 성공적으로 등록되었습니다.');
    } catch (error) {
      alert('대여 등록에 실패했습니다.');
    }
  };

  const handleReturnRental = async (id: number) => {
    if (!confirm('이 물품을 반납 처리하시겠습니까?')) return;

    setReturningId(id);
    try {
      await returnRentalMutation.mutateAsync(id);
      alert('반납이 완료되었습니다.');
    } catch (error) {
      alert('반납 처리에 실패했습니다.');
    } finally {
      setReturningId(undefined);
    }
  };

  const handleDeleteRental = async (id: number) => {
    if (!confirm('이 대여 기록을 삭제하시겠습니까?')) return;

    setDeletingId(id);
    try {
      await deleteRentalMutation.mutateAsync(id);
      alert('대여 기록이 삭제되었습니다.');
    } catch (error) {
      alert('대여 기록 삭제에 실패했습니다.');
    } finally {
      setDeletingId(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">대여/반납 관리</h1>
        <p className="text-gray-600">물품 대여 및 반납을 관리합니다</p>
      </div>

      {/* 대여 폼 */}
      <div className="mb-8">
        <RentalForm
          items={items}
          onSubmit={handleCreateRental}
          isSubmitting={createRentalMutation.isPending}
        />
      </div>

      {/* 대여 목록 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">대여 기록</h2>
        <RentalList
          rentals={rentals}
          onReturn={handleReturnRental}
          onDelete={handleDeleteRental}
          returningId={returningId}
          deletingId={deletingId}
        />
      </div>
    </div>
  );
};

// 데코레이터 패턴 적용
const Rentals = withLogger(
  withErrorBoundary(
    RentalsContent,
    '대여 관리 페이지를 불러오는 중 문제가 발생했습니다.'
  ),
  'Rentals'
);

export default Rentals;
