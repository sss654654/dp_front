import { create } from 'zustand';
import { Rental } from '../types';

/**
 * 옵저버 패턴을 위한 Observer 타입 정의
 */
type Observer = () => void;

interface RentalStore {
  // 상태
  rentals: Rental[];
  lastUpdate: number;
  observers: Observer[];

  // 액션
  setRentals: (rentals: Rental[]) => void;
  addRental: (rental: Rental) => void;
  updateRental: (id: number, rental: Rental) => void;
  removeRental: (id: number) => void;

  // 옵저버 패턴 메서드
  subscribe: (observer: Observer) => () => void;
  notifyObservers: () => void;
}

/**
 * Zustand 스토어
 * 대여 상태를 전역으로 관리하며, 옵저버 패턴을 통해
 * 상태 변경 시 구독 중인 컴포넌트들에게 알립니다.
 */
export const useRentalStore = create<RentalStore>((set, get) => ({
  rentals: [],
  lastUpdate: Date.now(),
  observers: [],

  setRentals: (rentals) => {
    set({ rentals, lastUpdate: Date.now() });
    get().notifyObservers();
  },

  addRental: (rental) => {
    set((state) => ({
      rentals: [...state.rentals, rental],
      lastUpdate: Date.now(),
    }));
    get().notifyObservers();
  },

  updateRental: (id, rental) => {
    set((state) => ({
      rentals: state.rentals.map((r) => (r.id === id ? rental : r)),
      lastUpdate: Date.now(),
    }));
    get().notifyObservers();
  },

  removeRental: (id) => {
    set((state) => ({
      rentals: state.rentals.filter((r) => r.id !== id),
      lastUpdate: Date.now(),
    }));
    get().notifyObservers();
  },

  /**
   * 옵저버 패턴: 구독 메서드
   * 컴포넌트가 대여 상태 변경을 구독할 수 있도록 합니다.
   * @param observer 상태 변경 시 호출될 콜백 함수
   * @returns 구독 해제 함수
   */
  subscribe: (observer) => {
    set((state) => ({
      observers: [...state.observers, observer],
    }));

    // 구독 해제 함수 반환
    return () => {
      set((state) => ({
        observers: state.observers.filter((obs) => obs !== observer),
      }));
    };
  },

  /**
   * 옵저버 패턴: 알림 메서드
   * 모든 구독자들에게 상태 변경을 알립니다.
   */
  notifyObservers: () => {
    const { observers } = get();
    observers.forEach((observer) => observer());
  },
}));
