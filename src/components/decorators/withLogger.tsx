import React, { useEffect } from 'react';

/**
 * 데코레이터 패턴 (Decorator Pattern) - 로거 데코레이터
 *
 * 컴포넌트를 감싸서 로깅 기능을 동적으로 추가합니다.
 * 컴포넌트의 라이프사이클(마운트, 언마운트, props 변경)을 자동으로 로깅합니다.
 *
 * 장점:
 * - 디버깅 용이: 컴포넌트 동작 추적
 * - 성능 모니터링: 렌더링 시간 측정 가능
 * - 비침투적: 원본 컴포넌트 코드 수정 불필요
 */

interface WithLoggerProps {
  enableLogger?: boolean;
}

/**
 * 로거 데코레이터 HOC
 * @param WrappedComponent 감쌀 대상 컴포넌트
 * @param componentName 컴포넌트 이름 (로깅용)
 * @returns 로깅 기능이 추가된 컴포넌트
 */
export function withLogger<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) {
  const displayName = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component';

  return (props: P & WithLoggerProps) => {
    const { enableLogger = true, ...restProps } = props;

    useEffect(() => {
      if (enableLogger) {
        const mountTime = performance.now();
        console.log(`📊 [데코레이터 패턴 - Logger] ${displayName} 마운트됨`);
        console.log(`📌 Props:`, restProps);

        return () => {
          const unmountTime = performance.now();
          const lifeTime = unmountTime - mountTime;
          console.log(`📊 [데코레이터 패턴 - Logger] ${displayName} 언마운트됨`);
          console.log(`⏱️ 생존 시간: ${lifeTime.toFixed(2)}ms`);
        };
      }
    }, [enableLogger, restProps]);

    useEffect(() => {
      if (enableLogger) {
        console.log(`🔄 [데코레이터 패턴 - Logger] ${displayName} Props 업데이트됨`, restProps);
      }
    }, [enableLogger, restProps]);

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
 * const MyComponentWithLogger = withLogger(MyComponent, 'MyComponent');
 *
 * <MyComponentWithLogger data={data} enableLogger={true} />
 */

/**
 * 여러 데코레이터를 조합하여 사용하는 예시:
 *
 * const EnhancedComponent = withLogger(
 *   withErrorBoundary(
 *     withLoading(MyComponent)
 *   ),
 *   'EnhancedComponent'
 * );
 *
 * <EnhancedComponent
 *   data={data}
 *   isLoading={isLoading}
 *   enableLogger={true}
 * />
 */
