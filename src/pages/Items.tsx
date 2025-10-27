/**
 * 물품 관리 페이지
 *
 * 디자인 패턴 적용:
 * 1. 전략 패턴: itemApiService를 통한 API 호출
 * 2. 데코레이터 패턴: withLoading, withErrorBoundary로 기능 확장
 */

import React, { useState } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ItemGrid } from '../components/items/ItemGrid';
import { ItemForm } from '../components/items/ItemForm';
import { useItems, useCreateItem, useUpdateItem, useDeleteItem } from '../hooks/useItems';
import { withErrorBoundary } from '../components/decorators/withErrorBoundary';
import { withLogger } from '../components/decorators/withLogger';
import { Item } from '../types';

const ItemsContent: React.FC = () => {
  const { data: items = [], isLoading } = useItems();
  const createItemMutation = useCreateItem();
  const updateItemMutation = useUpdateItem();
  const deleteItemMutation = useDeleteItem();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | undefined>();
  const [deletingId, setDeletingId] = useState<number | undefined>();

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8F9FA]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-gray-600 font-medium mt-4">로딩 중...</p>
      </div>
    );
  }

  const handleCreateOrUpdate = async (data: any) => {
    try {
      if (editingItem) {
        // 수정
        await updateItemMutation.mutateAsync({
          id: editingItem.id,
          data,
        });
        alert('물품이 성공적으로 수정되었습니다.');
      } else {
        // 등록
        await createItemMutation.mutateAsync(data);
        alert('물품이 성공적으로 등록되었습니다.');
      }
      setIsModalOpen(false);
      setEditingItem(undefined);
    } catch (error) {
      alert(editingItem ? '물품 수정에 실패했습니다.' : '물품 등록에 실패했습니다.');
    }
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('이 물품을 삭제하시겠습니까?')) return;

    setDeletingId(id);
    try {
      await deleteItemMutation.mutateAsync(id);
      alert('물품이 삭제되었습니다.');
    } catch (error) {
      alert('물품 삭제에 실패했습니다.');
    } finally {
      setDeletingId(undefined);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingItem(undefined);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6">
      {/* 헤더 */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">물품 관리</h1>
          <p className="text-gray-600">물품을 등록하고 관리합니다</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          size="lg"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          물품 등록
        </Button>
      </div>

      {/* 물품 그리드 */}
      <ItemGrid
        items={items}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deletingId={deletingId}
      />

      {/* 물품 등록/수정 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingItem ? '물품 수정' : '물품 등록'}
        size="md"
      >
        <ItemForm
          item={editingItem}
          onSubmit={handleCreateOrUpdate}
          onCancel={handleModalClose}
          isSubmitting={createItemMutation.isPending || updateItemMutation.isPending}
        />
      </Modal>
    </div>
  );
};

// 데코레이터 패턴 적용
const Items = withLogger(
  withErrorBoundary(
    ItemsContent,
    '물품 관리 페이지를 불러오는 중 문제가 발생했습니다.'
  ),
  'Items'
);

export default Items;
