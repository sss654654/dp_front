import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { Card } from '../common/Card';
import { Rental } from '../../types';

interface RecentActivityProps {
  rentals: Rental[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ rentals }) => {
  // 최근 대여/반납 각 5건씩 가져오기
  const recentRentals = rentals
    .filter((r) => r.status === 'ONGOING')
    .sort((a, b) => new Date(b.rentalDate).getTime() - new Date(a.rentalDate).getTime())
    .slice(0, 5);

  const recentReturns = rentals
    .filter((r) => r.status === 'COMPLETED' && r.returnDate)
    .sort((a, b) => new Date(b.returnDate!).getTime() - new Date(a.returnDate!).getTime())
    .slice(0, 5);

  const activities = [
    ...recentRentals.map((r) => ({
      id: r.id,
      type: 'rental' as const,
      itemName: r.itemName,
      renterName: r.renterName,
      date: r.rentalDate,
    })),
    ...recentReturns.map((r) => ({
      id: r.id,
      type: 'return' as const,
      itemName: r.itemName,
      renterName: r.renterName,
      date: r.returnDate!,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <Card>
      <h3 className="text-lg font-bold text-gray-900 mb-4">최근 활동</h3>
      <div className="space-y-3">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-8">최근 활동이 없습니다.</p>
        ) : (
          activities.map((activity) => (
            <div
              key={`${activity.type}-${activity.id}`}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div
                className={`p-2 rounded-full ${
                  activity.type === 'rental' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                }`}
              >
                {activity.type === 'rental' ? (
                  <Clock className="w-4 h-4" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {activity.type === 'rental' ? '대여' : '반납'}: {activity.itemName}
                </p>
                <p className="text-xs text-gray-500">{activity.renterName}</p>
              </div>
              <div className="text-xs text-gray-400">
                {new Date(activity.date).toLocaleString('ko-KR', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
