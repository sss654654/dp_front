import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Card } from '../common/Card';
import { Rental } from '../../types';

interface PopularItemsProps {
  rentals: Rental[];
}

export const PopularItems: React.FC<PopularItemsProps> = ({ rentals }) => {
  // 대여 빈도 계산
  const itemCounts = rentals.reduce((acc, rental) => {
    acc[rental.itemName] = (acc[rental.itemName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Top 5 인기 물품
  const popularItems = Object.entries(itemCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count], index) => ({
      rank: index + 1,
      name,
      count,
    }));

  return (
    <Card>
      <h3 className="text-lg font-bold text-gray-900 mb-4">인기 물품 Top 5</h3>
      <div className="space-y-3">
        {popularItems.length === 0 ? (
          <p className="text-gray-500 text-center py-8">대여 기록이 없습니다.</p>
        ) : (
          popularItems.map((item) => (
            <div
              key={item.name}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                  ${
                    item.rank === 1
                      ? 'bg-yellow-100 text-yellow-700'
                      : item.rank === 2
                      ? 'bg-gray-200 text-gray-700'
                      : item.rank === 3
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-blue-100 text-blue-700'
                  }
                `}
              >
                {item.rank}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <TrendingUp className="w-4 h-4" />
                <span className="font-semibold">{item.count}회</span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
