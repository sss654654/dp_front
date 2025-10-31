/**
 * 전략 패턴 (Strategy Pattern)
 * API 호출 방식을 캡슐화하여 교체 가능하게 만듭니다.
 * 각 API 엔드포인트별 호출 로직을 독립적인 전략 객체로 분리하여
 * 코드의 유연성과 확장성을 높입니다.
 */

import api from './api';
import {
  Rental,
  Item,
  CreateRentalRequest,
  CreateItemRequest,
  UpdateRentalRequest,
  UpdateItemRequest,
  RentalStatus,
} from '../types';

// ============================================
// 전략 인터페이스 정의
// ============================================

/**
 * 대여 API 전략 인터페이스
 * 모든 대여 관련 API 전략은 이 인터페이스를 구현해야 합니다.
 */
interface RentalApiStrategy {
  execute(...args: any[]): Promise<any>;
}

/**
 * 물품 API 전략 인터페이스
 * 모든 물품 관련 API 전략은 이 인터페이스를 구현해야 합니다.
 */
interface ItemApiStrategy {
  execute(...args: any[]): Promise<any>;
}

// ============================================
// 대여 API 구체적 전략 클래스
// ============================================

/**
 * 대여 목록 조회 전략
 * GET /api/rentals
 */
class GetRentalsStrategy implements RentalApiStrategy {
  async execute(status?: RentalStatus): Promise<Rental[]> {
    // status가 있을 때만 params 전달, 없으면 params 자체를 보내지 않음
    const config = status ? { params: { status } } : {};
    const response = await api.get<Rental[]>('/rentals', config);
    console.log('✅ [전략 패턴] 대여 목록 조회 성공:', response.data.length, '건');
    return response.data;
  }
}

/**
 * 품목 대여 생성 전략
 * POST /api/rentals
 */
class CreateRentalStrategy implements RentalApiStrategy {
  async execute(data: CreateRentalRequest): Promise<Rental> {
    console.log('📤 [전략 패턴] 대여 생성 요청 데이터:', data);
    const response = await api.post<Rental>('/rentals', data);
    console.log('✅ [전략 패턴] 대여 생성 응답:', response.data);
    return response.data;
  }
}

/**
 * 대여 정보 수정 전략
 * PUT /api/rentals/{id}
 */
class UpdateRentalStrategy implements RentalApiStrategy {
  async execute(id: number, data: UpdateRentalRequest): Promise<Rental> {
    const response = await api.put<Rental>(`/rentals/${id}`, data);
    return response.data;
  }
}

/**
 * 대여 정보 부분 수정 전략
 * PATCH /api/rentals/{id}
 */
class PatchRentalStrategy implements RentalApiStrategy {
  async execute(id: number, data: Partial<UpdateRentalRequest>): Promise<Rental> {
    const response = await api.patch<Rental>(`/rentals/${id}`, data);
    return response.data;
  }
}

/**
 * 대여 기록 삭제 전략
 * DELETE /api/rentals/{id}
 */
class DeleteRentalStrategy implements RentalApiStrategy {
  async execute(id: number): Promise<void> {
    await api.delete(`/rentals/${id}`);
  }
}

/**
 * 품목 반납 전략
 * POST /api/rentals/{id}/return
 */
class ReturnRentalStrategy implements RentalApiStrategy {
  async execute(id: number): Promise<Rental> {
    const response = await api.post<Rental>(`/rentals/${id}/return`);
    return response.data;
  }
}

// ============================================
// 물품 API 구체적 전략 클래스
// ============================================

/**
 * 물품 목록 조회 전략
 * GET /api/items
 */
class GetItemsStrategy implements ItemApiStrategy {
  async execute(): Promise<Item[]> {
    const response = await api.get<Item[]>('/items');
    return response.data;
  }
}

/**
 * 물품 상세 조회 전략
 * GET /api/items/{id}
 */
class GetItemByIdStrategy implements ItemApiStrategy {
  async execute(id: number): Promise<Item> {
    const response = await api.get<Item>(`/items/${id}`);
    return response.data;
  }
}

/**
 * 물품 등록 전략
 * POST /api/items
 */
class CreateItemStrategy implements ItemApiStrategy {
  async execute(data: CreateItemRequest): Promise<Item> {
    const response = await api.post<Item>('/items', data);
    return response.data;
  }
}

/**
 * 물품 정보 수정 전략
 * PUT /api/items/{id}
 */
class UpdateItemStrategy implements ItemApiStrategy {
  async execute(id: number, data: UpdateItemRequest): Promise<Item> {
    const response = await api.put<Item>(`/items/${id}`, data);
    return response.data;
  }
}

/**
 * 물품 정보 부분 수정 전략
 * PATCH /api/items/{id}
 */
class PatchItemStrategy implements ItemApiStrategy {
  async execute(id: number, data: Partial<UpdateItemRequest>): Promise<Item> {
    console.log('📤 [전략 패턴] 물품 수정 요청 - ID:', id, 'Data:', JSON.stringify(data, null, 2));
    const response = await api.patch<Item>(`/items/${id}`, data);
    console.log('✅ [전략 패턴] 물품 수정 응답:', response.data);
    return response.data;
  }
}

/**
 * 물품 삭제 전략
 * DELETE /api/items/{id}
 */
class DeleteItemStrategy implements ItemApiStrategy {
  async execute(id: number): Promise<void> {
    await api.delete(`/items/${id}`);
  }
}

// ============================================
// API 서비스 클래스 (컨텍스트)
// ============================================

/**
 * 대여 API 서비스
 * 전략 패턴을 사용하여 각 API 호출을 독립적인 전략 객체로 실행합니다.
 */
export class RentalApiService {
  private getRentalsStrategy = new GetRentalsStrategy();
  private createRentalStrategy = new CreateRentalStrategy();
  private updateRentalStrategy = new UpdateRentalStrategy();
  private patchRentalStrategy = new PatchRentalStrategy();
  private deleteRentalStrategy = new DeleteRentalStrategy();
  private returnRentalStrategy = new ReturnRentalStrategy();

  async getRentals(status?: RentalStatus): Promise<Rental[]> {
    return this.getRentalsStrategy.execute(status);
  }

  async createRental(data: CreateRentalRequest): Promise<Rental> {
    return this.createRentalStrategy.execute(data);
  }

  async updateRental(id: number, data: UpdateRentalRequest): Promise<Rental> {
    return this.updateRentalStrategy.execute(id, data);
  }

  async patchRental(id: number, data: Partial<UpdateRentalRequest>): Promise<Rental> {
    return this.patchRentalStrategy.execute(id, data);
  }

  async deleteRental(id: number): Promise<void> {
    return this.deleteRentalStrategy.execute(id);
  }

  async returnRental(id: number): Promise<Rental> {
    return this.returnRentalStrategy.execute(id);
  }
}

/**
 * 물품 API 서비스
 * 전략 패턴을 사용하여 각 API 호출을 독립적인 전략 객체로 실행합니다.
 */
export class ItemApiService {
  private getItemsStrategy = new GetItemsStrategy();
  private getItemByIdStrategy = new GetItemByIdStrategy();
  private createItemStrategy = new CreateItemStrategy();
  private updateItemStrategy = new UpdateItemStrategy();
  private patchItemStrategy = new PatchItemStrategy();
  private deleteItemStrategy = new DeleteItemStrategy();

  async getItems(): Promise<Item[]> {
    return this.getItemsStrategy.execute();
  }

  async getItemById(id: number): Promise<Item> {
    return this.getItemByIdStrategy.execute(id);
  }

  async createItem(data: CreateItemRequest): Promise<Item> {
    return this.createItemStrategy.execute(data);
  }

  async updateItem(id: number, data: UpdateItemRequest): Promise<Item> {
    return this.updateItemStrategy.execute(id, data);
  }

  async patchItem(id: number, data: Partial<UpdateItemRequest>): Promise<Item> {
    return this.patchItemStrategy.execute(id, data);
  }

  async deleteItem(id: number): Promise<void> {
    return this.deleteItemStrategy.execute(id);
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
export const rentalApiService = new RentalApiService();
export const itemApiService = new ItemApiService();
