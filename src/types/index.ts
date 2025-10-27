// TypeScript 타입 정의

export type RentalStatus = 'ONGOING' | 'COMPLETED' | 'OVERDUE';

export interface Rental {
  id: number;
  itemId: number;
  itemName: string;
  renterName: string;
  renterContact: string;
  status: RentalStatus;
  rentalDate: string;
  returnDate?: string;
  expectedReturnDate: string;
  notes?: string;
}

export interface Item {
  id: number;
  name: string;
  category: string;
  description: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
  stock: number;
  totalStock: number;
}

export interface CreateRentalRequest {
  itemId: number;
  renterName: string;
  renterContact: string;
  expectedReturnDate: string;
  notes?: string;
}

export interface CreateItemRequest {
  name: string;
  category: string;
  description: string;
  stock: number;
}

export interface UpdateRentalRequest {
  renterName?: string;
  renterContact?: string;
  expectedReturnDate?: string;
  notes?: string;
}

export interface UpdateItemRequest {
  name?: string;
  category?: string;
  description?: string;
  stock?: number;
}

export interface DashboardStats {
  ongoingRentals: number;
  availableItems: number;
  todayRentals: number;
  overdueRentals: number;
}
