import { useEffect, useRef, useState } from 'react';

interface WebSocketMessage {
  type: string;
  data: any;
}

/**
 * 웹소켓 연결 Hook
 * 대여/반납 이벤트 알림을 위한 웹소켓 연결 관리
 */
export const useWebSocket = (url: string, onMessage?: (message: WebSocketMessage) => void) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    let isMounted = true;

    const connect = () => {
      try {
        console.log('🔌 [WebSocket] 연결 시도:', url);
        const ws = new WebSocket(url);

        ws.onopen = () => {
          if (isMounted) {
            console.log('✅ [WebSocket] 연결 성공');
            setIsConnected(true);
          }
        };

        ws.onmessage = (event) => {
          if (isMounted) {
            try {
              const message = JSON.parse(event.data) as WebSocketMessage;
              console.log('📩 [WebSocket] 메시지 수신:', message);
              setLastMessage(message);
              onMessage?.(message);
            } catch (error) {
              console.error('❌ [WebSocket] 메시지 파싱 실패:', error);
            }
          }
        };

        ws.onerror = (error) => {
          console.error('❌ [WebSocket] 에러:', error);
        };

        ws.onclose = () => {
          if (isMounted) {
            console.log('🔌 [WebSocket] 연결 종료');
            setIsConnected(false);

            // 5초 후 재연결 시도
            reconnectTimeoutRef.current = setTimeout(() => {
              if (isMounted) {
                console.log('🔄 [WebSocket] 재연결 시도...');
                connect();
              }
            }, 5000);
          }
        };

        wsRef.current = ws;
      } catch (error) {
        console.error('❌ [WebSocket] 연결 실패:', error);
        if (isMounted) {
          // 5초 후 재연결 시도
          reconnectTimeoutRef.current = setTimeout(() => {
            if (isMounted) {
              connect();
            }
          }, 5000);
        }
      }
    };

    connect();

    return () => {
      isMounted = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url, onMessage]);

  const sendMessage = (message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('⚠️ [WebSocket] 연결되지 않음 - 메시지 전송 실패');
    }
  };

  return {
    isConnected,
    lastMessage,
    sendMessage,
  };
};
