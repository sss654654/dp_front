import React, { useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { Item } from '../../types';

interface ItemFormProps {
  item?: Item;
  onSubmit: (data: { name: string; category: string; description: string; stock?: number }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const ItemForm: React.FC<ItemFormProps> = ({ item, onSubmit, onCancel, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    imageUrl: '',
    stock: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (item) {
      // description에서 이미지 URL 추출
      const imgMatch = item.description.match(/\[IMG:(.*?)\]$/);
      const imageUrl = imgMatch ? imgMatch[1] : '';
      const description = imgMatch ? item.description.replace(/\[IMG:.*?\]$/, '').trim() : item.description;

      setFormData({
        name: item.name,
        category: item.category,
        description,
        imageUrl,
        stock: item.totalStock.toString(),
      });
    }
  }, [item]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = '물품명을 입력해주세요.';
    if (!formData.category.trim()) newErrors.category = '카테고리를 입력해주세요.';
    if (!formData.description.trim()) newErrors.description = '설명을 입력해주세요.';

    // 신규 등록 시에만 재고 검증
    if (!item && (!formData.stock || Number(formData.stock) < 1)) {
      newErrors.stock = '재고는 1개 이상이어야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    // 이미지 URL을 description에 포함
    let description = formData.description.trim();
    if (formData.imageUrl.trim()) {
      description += ` [IMG:${formData.imageUrl.trim()}]`;
    }

    // 수정 모드일 때는 stock을 제외하고 전송
    const submitData: any = {
      name: formData.name.trim(),
      category: formData.category.trim(),
      description,
    };

    // 신규 등록일 때만 stock 포함
    if (!item) {
      submitData.stock = Number(formData.stock);
    }

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 물품명 */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          물품명 *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003876] ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="예: 노트북"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* 카테고리 */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          카테고리 *
        </label>
        <input
          type="text"
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003876] ${
            errors.category ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="예: 전자기기"
        />
        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
      </div>

      {/* 설명 */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          설명 *
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003876] ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          rows={4}
          placeholder="물품에 대한 설명을 입력하세요"
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

      {/* 이미지 URL */}
      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
          이미지 URL (선택사항)
        </label>
        <input
          type="url"
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003876]"
          placeholder="https://example.com/image.jpg"
        />
        <p className="text-gray-500 text-xs mt-1">물품 이미지 URL을 입력하세요 (선택사항)</p>
        {formData.imageUrl && (
          <div className="mt-2">
            <img
              src={formData.imageUrl}
              alt="미리보기"
              className="w-32 h-32 object-cover rounded-lg border border-gray-300"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* 재고 수량 */}
      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
          재고 수량 {!item && '*'}
        </label>
        <input
          type="number"
          id="stock"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          disabled={!!item}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003876] ${
            errors.stock ? 'border-red-500' : 'border-gray-300'
          } ${item ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          min="1"
          placeholder="1"
        />
        {item && <p className="text-gray-500 text-xs mt-1">재고 수량은 수정 모드에서 변경할 수 없습니다.</p>}
        {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
      </div>

      {/* 버튼 */}
      <div className="flex space-x-3 pt-4">
        <Button type="button" onClick={onCancel} variant="outline" className="flex-1">
          취소
        </Button>
        <Button type="submit" variant="primary" className="flex-1" loading={isSubmitting}>
          {item ? '수정' : '등록'}
        </Button>
      </div>
    </form>
  );
};
