import React from 'react';
import { Calendar, User, Phone, FileText, Package, Trash2 } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Rental } from '../../types';

interface RentalItemProps {
  rental: Rental;
  onReturn: (id: number) => void;
  onDelete: (id: number) => void;
  isReturning?: boolean;
  isDeleting?: boolean;
}

export const RentalItem: React.FC<RentalItemProps> = ({
  rental,
  onReturn,
  onDelete,
  isReturning = false,
  isDeleting = false,
}) => {
  const isOverdue = rental.status === 'OVERDUE';
  const isCompleted = rental.status === 'COMPLETED';

  return (
    <Card
      className={`${
        isOverdue ? 'border-l-4 border-l-red-500 bg-red-50' : ''
      } ${isCompleted ? 'opacity-75' : ''}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div className="flex-1 space-y-3">
          {/* 물품 정보 */}
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-gray-500" />
            <span className="font-bold text-lg text-gray-900">{rental.itemName}</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                rental.status === 'ONGOING'
                  ? 'bg-blue-100 text-blue-700'
                  : rental.status === 'COMPLETED'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {rental.status === 'ONGOING'
                ? '대여중'
                : rental.status === 'COMPLETED'
                ? '반납완료'
                : '연체'}
            </span>
          </div>

          {/* 대여자 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <User className="w-4 h-4" />
              <span>{rental.renterName}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{rental.renterContact}</span>
            </div>
          </div>

          {/* 날짜 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>대여: {new Date(rental.rentalDate).toLocaleDateString('ko-KR')}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className={isOverdue ? 'text-red-600 font-semibold' : ''}>
                반납예정: {new Date(rental.expectedReturnDate).toLocaleDateString('ko-KR')}
              </span>
            </div>
            {rental.returnDate && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>실제반납: {new Date(rental.returnDate).toLocaleDateString('ko-KR')}</span>
              </div>
            )}
          </div>

          {/* 비고 */}
          {rental.notes && (
            <div className="flex items-start space-x-2 text-sm text-gray-600">
              <FileText className="w-4 h-4 mt-0.5" />
              <span>{rental.notes}</span>
            </div>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="flex space-x-2">
          {(rental.status === 'ONGOING' || rental.status === 'OVERDUE') && (
            <Button
              onClick={() => onReturn(rental.id)}
              variant="primary"
              size="sm"
              loading={isReturning}
            >
              반납
            </Button>
          )}
          {rental.status === 'COMPLETED' && (
            <Button
              onClick={() => onDelete(rental.id)}
              variant="danger"
              size="sm"
              loading={isDeleting}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              삭제
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
