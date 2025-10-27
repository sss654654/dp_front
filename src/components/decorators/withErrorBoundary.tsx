import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * 데코레이터 패턴 (Decorator Pattern) - 에러 바운더리 데코레이터
 *
 * 컴포넌트를 감싸서 에러 처리 기능을 동적으로 추가합니다.
 * 하위 컴포넌트에서 발생하는 에러를 catch하고 폴백 UI를 표시합니다.
 *
 * 장점:
 * - 에러 격리: 에러가 전체 앱을 중단시키지 않음
 * - 사용자 경험 향상: 친화적인 에러 메시지 표시
 * - 디버깅 용이: 에러 정보 로깅
 */

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackMessage?: string;
}

/**
 * 에러 바운더리 클래스 컴포넌트
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('🚨 [데코레이터 패턴 - ErrorBoundary] 에러 발생:', error);
    console.error('에러 정보:', errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <h2 className="text-xl font-bold text-red-700">에러 발생</h2>
            </div>
            <p className="text-gray-700 mb-4">
              {this.props.fallbackMessage ||
                '일시적인 오류가 발생했습니다. 다시 시도해주세요.'}
            </p>
            {this.state.error && (
              <details className="mb-4">
                <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                  에러 상세 정보
                </summary>
                <pre className="mt-2 p-2 bg-red-100 rounded text-xs overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleReset}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * 에러 바운더리 데코레이터 HOC
 * @param WrappedComponent 감쌀 대상 컴포넌트
 * @param fallbackMessage 커스텀 에러 메시지
 * @returns 에러 처리 기능이 추가된 컴포넌트
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallbackMessage?: string
) {
  return (props: P) => {
    return (
      <ErrorBoundary fallbackMessage={fallbackMessage}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

/**
 * 사용 예시:
 *
 * const MyComponent = ({ data }) => {
 *   if (!data) throw new Error('데이터가 없습니다');
 *   return <div>{data}</div>;
 * };
 *
 * const SafeMyComponent = withErrorBoundary(
 *   MyComponent,
 *   '데이터를 불러오는 중 문제가 발생했습니다.'
 * );
 *
 * <SafeMyComponent data={data} />
 */
