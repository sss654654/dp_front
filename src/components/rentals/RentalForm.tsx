import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Item } from '../../types';

interface RentalFormProps {
  items: Item[];
  onSubmit: (data: {
    itemId: number;
    renterName: string;
    renterContact: string;
    expectedReturnDate: string;
    notes?: string;
  }) => void;
  isSubmitting?: boolean;
}

export const RentalForm: React.FC<RentalFormProps> = ({ items, onSubmit, isSubmitting = false }) => {
  // 기본 반납 예정일을 2일 뒤로 설정 (대여일 포함 3일 사용 가능)
  const getDefaultReturnDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    itemId: '',
    renterName: '',
    renterContact: '',
    expectedReturnDate: getDefaultReturnDate(),
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableItems = items.filter((item) => item.available && item.stock > 0);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.itemId) newErrors.itemId = '물품을 선택해주세요.';
    if (!formData.renterName.trim()) newErrors.renterName = '대여자 이름을 입력해주세요.';
    if (!formData.renterContact.trim()) newErrors.renterContact = '연락처를 입력해주세요.';
    if (!formData.expectedReturnDate) newErrors.expectedReturnDate = '반납 예정일을 선택해주세요.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    // ISO 8601 형식으로 날짜 변환 (사용자가 선택한 날짜의 23:59:59로 설정)
    const date = new Date(formData.expectedReturnDate);
    date.setHours(23, 59, 59, 999);
    const expectedReturnDateTime = date.toISOString();

    const requestData: any = {
      itemId: Number(formData.itemId),
      renterName: formData.renterName.trim(),
      renterContact: formData.renterContact.trim(),
      expectedReturnDate: expectedReturnDateTime,
    };

    // notes가 있을 때만 추가
    if (formData.notes.trim()) {
      requestData.notes = formData.notes.trim();
    }

    console.log('📝 [RentalForm] 제출 데이터:', requestData);

    onSubmit(requestData);

    // 폼 초기화 (반납 예정일은 다시 3일 뒤로 설정)
    setFormData({
      itemId: '',
      renterName: '',
      renterContact: '',
      expectedReturnDate: getDefaultReturnDate(),
      notes: '',
    });
    setErrors({});
  };

  return (
    <Card>
      <h3 className="text-lg font-bold text-gray-900 mb-4">물품 대여</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 물품 선택 */}
        <div>
          <label htmlFor="itemId" className="block text-sm font-medium text-gray-700 mb-1">
            물품 선택 *
          </label>
          <select
            id="itemId"
            value={formData.itemId}
            onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003876] ${
              errors.itemId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">물품을 선택하세요</option>
            {availableItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} (재고: {item.stock}/{item.totalStock})
              </option>
            ))}
          </select>
          {errors.itemId && <p className="text-red-500 text-xs mt-1">{errors.itemId}</p>}
        </div>

        {/* 대여자 이름 */}
        <div>
          <label htmlFor="renterName" className="block text-sm font-medium text-gray-700 mb-1">
            대여자 이름 *
          </label>
          <input
            type="text"
            id="renterName"
            value={formData.renterName}
            onChange={(e) => setFormData({ ...formData, renterName: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003876] ${
              errors.renterName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="홍길동"
          />
          {errors.renterName && <p className="text-red-500 text-xs mt-1">{errors.renterName}</p>}
        </div>

        {/* 연락처 */}
        <div>
          <label htmlFor="renterContact" className="block text-sm font-medium text-gray-700 mb-1">
            연락처 *
          </label>
          <input
            type="text"
            id="renterContact"
            value={formData.renterContact}
            onChange={(e) => setFormData({ ...formData, renterContact: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003876] ${
              errors.renterContact ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="010-1234-5678"
          />
          {errors.renterContact && <p className="text-red-500 text-xs mt-1">{errors.renterContact}</p>}
        </div>

        {/* 반납 예정일 */}
        <div>
          <label htmlFor="expectedReturnDate" className="block text-sm font-medium text-gray-700 mb-1">
            반납 예정일 (자동 설정: 대여일 +2일)
          </label>
          <input
            type="date"
            id="expectedReturnDate"
            value={formData.expectedReturnDate}
            readOnly
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
          />
          <p className="text-gray-500 text-xs mt-1">반납 예정일은 대여일로부터 2일 뒤로 자동 설정됩니다.</p>
        </div>

        {/* 비고 */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            비고
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003876]"
            rows={3}
            placeholder="추가 정보를 입력하세요 (선택사항)"
          />
        </div>

        {/* 제출 버튼 */}
        <Button type="submit" variant="primary" className="w-full" loading={isSubmitting}>
          대여 등록
        </Button>
      </form>
    </Card>
  );
};
