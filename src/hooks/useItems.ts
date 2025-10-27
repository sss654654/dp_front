import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemApiService } from '../services/apiStrategies';
import { CreateItemRequest, UpdateItemRequest } from '../types';

/**
 * 물품 목록 조회 훅
 */
export const useItems = () => {
  return useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      try {
        return await itemApiService.getItems();
      } catch (error) {
        console.error('물품 목록 조회 실패:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5분
    refetchOnWindowFocus: true,
  });
};

/**
 * 물품 상세 조회 훅
 */
export const useItem = (id: number) => {
  return useQuery({
    queryKey: ['items', id],
    queryFn: async () => {
      try {
        return await itemApiService.getItemById(id);
      } catch (error) {
        console.error('물품 상세 조회 실패:', error);
        throw error;
      }
    },
    enabled: !!id,
  });
};

/**
 * 물품 등록 훅
 */
export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateItemRequest) => {
      try {
        return await itemApiService.createItem(data);
      } catch (error) {
        console.error('물품 등록 실패:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

/**
 * 물품 정보 수정 훅
 */
export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateItemRequest }) => {
      try {
        return await itemApiService.updateItem(id, data);
      } catch (error) {
        console.error('물품 정보 수정 실패:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

/**
 * 물품 삭제 훅
 */
export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        await itemApiService.deleteItem(id);
        return id;
      } catch (error) {
        console.error('물품 삭제 실패:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};
