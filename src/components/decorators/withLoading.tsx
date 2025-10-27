import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * 데코레이터 패턴 (Decorator Pattern) - 로딩 데코레이터
 *
 * 컴포넌트를 감싸서 로딩 상태 표시 기능을 동적으로 추가합니다.
 * 기존 컴포넌트의 코드를 수정하지 않고도 로딩 UI를 제공할 수 있습니다.
 *
 * 장점:
 * - 단일 책임 원칙: 로딩 로직과 비즈니스 로직 분리
 * - 재사용성: 여러 컴포넌트에 동일한 로딩 UI 적용 가능
 * - 확장성: 다른 데코레이터와 조합 가능
 */

interface WithLoadingProps {
  isLoading: boolean;
  loadingText?: string;
}

/**
 * 로딩 데코레이터 HOC
 * @param WrappedComponent 감쌀 대상 컴포넌트
 * @returns 로딩 기능이 추가된 컴포넌트
 */
export function withLoading<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return (props: P & WithLoadingProps) => {
    const { isLoading, loadingText = '로딩 중...', ...restProps } = props;

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-gray-600 font-medium">{loadingText}</p>
        </div>
      );
    }

    return <WrappedComponent {...(restProps as P)} />;
  };
}

/**
 * 사용 예시:
 *
 * const MyComponent = ({ data }) => {
 *   return <div>{data}</div>;
 * };
 *
 * const MyComponentWithLoading = withLoading(MyComponent);
 *
 * <MyComponentWithLoading
 *   data={data}
 *   isLoading={isLoading}
 *   loadingText="데이터 로딩 중..."
 * />
 */
