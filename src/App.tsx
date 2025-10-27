import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LayoutDashboard, Package, ShoppingCart } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Rentals from './pages/Rentals';
import Items from './pages/Items';

// React Query 클라이언트 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex min-h-screen bg-[#F8F9FA]">
          {/* 사이드바 네비게이션 */}
          <nav className="w-64 bg-[#003876] text-white p-6 flex flex-col">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">디자인패턴 4조</h2>
              <p className="text-sm text-gray-300">편의물품 대여 시스템</p>
            </div>

            <div className="space-y-2 flex-1">
              <NavLink to="/dashboard" icon={LayoutDashboard}>
                대시보드
              </NavLink>
              <NavLink to="/rentals" icon={ShoppingCart}>
                대여/반납 관리
              </NavLink>
              <NavLink to="/items" icon={Package}>
                물품 관리
              </NavLink>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-600">
              <p className="text-xs text-gray-400">
                © 2025 단국대 디자인패턴 4조
              </p>
            </div>
          </nav>

          {/* 메인 컨텐츠 */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/rentals" element={<Rentals />} />
              <Route path="/items" element={<Items />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

// 네비게이션 링크 컴포넌트
interface NavLinkProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon: Icon, children }) => {
  return (
    <Link
      to={to}
      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-[#002855] transition-colors"
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{children}</span>
    </Link>
  );
};

export default App;
