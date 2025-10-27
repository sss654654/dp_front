import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Package, AlertCircle } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: '물품 대여',
      icon: PlusCircle,
      onClick: () => navigate('/rentals'),
      variant: 'primary' as const,
    },
    {
      label: '물품 등록',
      icon: Package,
      onClick: () => navigate('/items'),
      variant: 'secondary' as const,
    },
    {
      label: '연체 목록',
      icon: AlertCircle,
      onClick: () => navigate('/rentals?filter=overdue'),
      variant: 'danger' as const,
    },
  ];

  return (
    <Card>
      <h3 className="text-lg font-bold text-gray-900 mb-4">빠른 액션</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action) => (
          <Button
            key={action.label}
            onClick={action.onClick}
            variant={action.variant}
            className="w-full"
          >
            <action.icon className="w-5 h-5 mr-2" />
            {action.label}
          </Button>
        ))}
      </div>
    </Card>
  );
};
