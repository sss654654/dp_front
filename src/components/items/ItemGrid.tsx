import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { Card } from '../common/Card';
import { ItemCard } from './ItemCard';
import { Item } from '../../types';

interface ItemGridProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (id: number) => void;
  deletingId?: number;
}

export const ItemGrid: React.FC<ItemGridProps> = ({ items, onEdit, onDelete, deletingId }) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [availableFilter, setAvailableFilter] = useState<string>('ALL');

  // 카테고리 목록 추출
  const categories = Array.from(new Set(items.map((item) => item.category)));

  // 필터링
  const filteredItems = items.filter((item) => {
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesAvailable =
      availableFilter === 'ALL' ||
      (availableFilter === 'AVAILABLE' && item.available && item.stock > 0) ||
      (availableFilter === 'UNAVAILABLE' && (!item.available || item.stock === 0));
    return matchesCategory && matchesAvailable;
  });

  return (
    <div className="space-y-4">
      {/* 필터 */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center space-x-2 flex-1">
            <Filter className="text-gray-400 w-5 h-5" />
            <span className="text-sm font-medium text-gray-700">카테고리:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003876]"
            >
              <option value="ALL">전체</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2 flex-1">
            <Filter className="text-gray-400 w-5 h-5" />
            <span className="text-sm font-medium text-gray-700">대여가능:</span>
            <select
              value={availableFilter}
              onChange={(e) => setAvailableFilter(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003876]"
            >
              <option value="ALL">전체</option>
              <option value="AVAILABLE">대여 가능</option>
              <option value="UNAVAILABLE">대여 불가</option>
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          총 {filteredItems.length}개의 물품
        </div>
      </Card>

      {/* 그리드 */}
      {filteredItems.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500 py-8">물품이 없습니다.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
              isDeleting={deletingId === item.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};
