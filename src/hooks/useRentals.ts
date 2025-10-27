import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rentalApiService } from '../services/apiStrategies';
import { CreateRentalRequest, UpdateRentalRequest, RentalStatus } from '../types';
import { useRentalStore } from '../stores/rentalStore';

/**
 * 대여 목록 조회 훅
 */
export const useRentals = (status?: RentalStatus) => {
  const { setRentals } = useRentalStore();

  return useQuery({
    queryKey: ['rentals', status],
    queryFn: async () => {
      try {
        console.log('📥 [useRentals] 대여 목록 조회 시작, status:', status || '전체');
        const data = await rentalApiService.getRentals(status);
        setRentals(data); // Zustand 스토어 업데이트 (옵저버 패턴 트리거)
        console.log('✅ [useRentals] 대여 목록 조회 완료:', data.length, '건');
        return data;
      } catch (error) {
        console.error('❌ [useRentals] 대여 목록 조회 실패:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5분
    refetchOnWindowFocus: true,
    retry: 1, // 실패 시 1번만 재시도
  });
};

/**
 * 품목 대여 생성 훅
 */
export const useCreateRental = () => {
  const queryClient = useQueryClient();
  const { addRental } = useRentalStore();

  return useMutation({
    mutationFn: async (data: CreateRentalRequest) => {
      try {
        return await rentalApiService.createRental(data);
      } catch (error) {
        console.error('품목 대여 생성 실패:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      // React Query 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });

      // Zustand 스토어 업데이트 (옵저버 패턴 트리거)
      addRental(data);
    },
  });
};

/**
 * 대여 정보 수정 훅
 */
export const useUpdateRental = () => {
  const queryClient = useQueryClient();
  const { updateRental } = useRentalStore();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateRentalRequest }) => {
      try {
        return await rentalApiService.updateRental(id, data);
      } catch (error) {
        console.error('대여 정보 수정 실패:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      updateRental(data.id, data);
    },
  });
};

/**
 * 대여 기록 삭제 훅
 */
export const useDeleteRental = () => {
  const queryClient = useQueryClient();
  const { removeRental } = useRentalStore();

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        await rentalApiService.deleteRental(id);
        return id;
      } catch (error) {
        console.error('대여 기록 삭제 실패:', error);
        throw error;
      }
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      removeRental(id);
    },
  });
};

/**
 * 품목 반납 훅
 */
export const useReturnRental = () => {
  const queryClient = useQueryClient();
  const { updateRental } = useRentalStore();

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        return await rentalApiService.returnRental(id);
      } catch (error) {
        console.error('품목 반납 실패:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
      updateRental(data.id, data);
    },
  });
};
