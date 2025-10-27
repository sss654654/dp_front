import axios from 'axios';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: 'https://designpattern.ellen24k.r-e.kr/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    // 요청 전 처리 (예: 토큰 추가)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 에러 처리
    console.error('❌ API Error:', error);
    if (error.response) {
      console.error('❌ 응답 상태:', error.response.status);
      console.error('❌ 응답 데이터:', error.response.data);
      console.error('❌ 응답 헤더:', error.response.headers);
    } else if (error.request) {
      console.error('❌ 요청:', error.request);
    } else {
      console.error('❌ 에러 메시지:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
