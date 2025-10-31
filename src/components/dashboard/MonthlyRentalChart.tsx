import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../common/Card';
import { Rental } from '../../types';

interface MonthlyRentalChartProps {
  rentals: Rental[];
}

export const MonthlyRentalChart: React.FC<MonthlyRentalChartProps> = ({ rentals }) => {
  // 월별 대여 통계 계산
  const monthlyData = useMemo(() => {
    const monthMap = new Map<string, { month: string; rentals: number; returns: number }>();

    // 최근 12개월 초기화
    const today = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
      monthMap.set(key, { month: label, rentals: 0, returns: 0 });
    }

    // 대여 데이터 집계
    rentals.forEach((rental) => {
      // 대여일 집계
      const rentalDate = new Date(rental.rentalDate);
      const rentalKey = `${rentalDate.getFullYear()}-${String(rentalDate.getMonth() + 1).padStart(2, '0')}`;

      if (monthMap.has(rentalKey)) {
        const data = monthMap.get(rentalKey)!;
        data.rentals += 1;
      }

      // 반납일 집계
      if (rental.returnDate) {
        const returnDate = new Date(rental.returnDate);
        const returnKey = `${returnDate.getFullYear()}-${String(returnDate.getMonth() + 1).padStart(2, '0')}`;

        if (monthMap.has(returnKey)) {
          const data = monthMap.get(returnKey)!;
          data.returns += 1;
        }
      }
    });

    return Array.from(monthMap.values());
  }, [rentals]);

  return (
    <Card>
      <h3 className="text-lg font-bold text-gray-900 mb-4">월별 대여 통계 (최근 12개월)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            angle={-45}
            textAnchor="end"
            height={100}
            style={{ fontSize: '12px' }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="rentals" fill="#003876" name="대여" />
          <Bar dataKey="returns" fill="#E8112D" name="반납" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
