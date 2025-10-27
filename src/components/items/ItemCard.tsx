import React from 'react';
import { Package, Edit, Trash2 } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Item } from '../../types';

interface ItemCardProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onEdit, onDelete, isDeleting = false }) => {
  const isLowStock = item.stock <= item.totalStock * 0.2 && item.stock > 0;
  const isOutOfStock = item.stock === 0;

  return (
    <Card className={`${isOutOfStock ? 'bg-gray-100 opacity-75' : ''} relative`}>
      {/* 재고 상태 배지 */}
      <div className="absolute top-4 right-4">
        {isOutOfStock ? (
          <span className="px-2 py-1 bg-gray-600 text-white text-xs font-semibold rounded-full">
            재고없음
          </span>
        ) : isLowStock ? (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
            재고부족
          </span>
        ) : item.available ? (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
            대여가능
          </span>
        ) : (
          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
            대여불가
          </span>
        )}
      </div>

      {/* 물품 정보 */}
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-1">{item.name}</h3>
            <p className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded inline-block">
              {item.category}
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-700 line-clamp-2">{item.description}</p>

        {/* 재고 현황 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">재고 현황</span>
            <span className={`font-semibold ${isOutOfStock ? 'text-red-600' : isLowStock ? 'text-yellow-600' : 'text-green-600'}`}>
              {item.stock} / {item.totalStock}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                isOutOfStock ? 'bg-gray-600' : isLowStock ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${(item.stock / item.totalStock) * 100}%` }}
            />
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex space-x-2 pt-2">
          <Button onClick={() => onEdit(item)} variant="outline" size="sm" className="flex-1">
            <Edit className="w-4 h-4 mr-1" />
            수정
          </Button>
          <Button
            onClick={() => onDelete(item.id)}
            variant="danger"
            size="sm"
            className="flex-1"
            loading={isDeleting}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            삭제
          </Button>
        </div>

        {/* 등록일 */}
        <div className="text-xs text-gray-400 pt-2 border-t border-gray-200">
          등록일: {new Date(item.createdAt).toLocaleDateString('ko-KR')}
        </div>
      </div>
    </Card>
  );
};
