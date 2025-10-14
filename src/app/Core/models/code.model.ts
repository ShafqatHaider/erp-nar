export interface CodeCategory {
  id: number;
  cateName: string;
  totalItems?: number;
  activeItems?: number;
  isActive?: number;
}

export interface CodeItem {
  id: number;
  name: string;
  categoryId: number;
  categoryName?: string;
  accId: number;
  brandName?: string;
  tpRates: number;
  costPrice: number;
  costPercent: number;
  salePrice: number;
  salePercent: number;
  stockQty: number;
  unitId: number;
  unitName?: string;
  productCode: string;
  description: string;
  branchId: number;
  userId: number;
  isMostSoldItem: number;
  isActive: number;
  createdAt?: string;
}

export interface CreateCodeCategory {
  cateName: string;
}

export interface CreateCodeItem {
  name: string;
  categoryId: number;
  accId: number;
  tpRates: number;
  costPrice: number;
  costPercent: number;
  salePrice: number;
  salePercent: number;
  stockQty: number;
  unitId: number;
  productCode: string;
  description: string;
  branchId: number;
  userId: number;
  isMostSoldItem: number;
  isActive: number;
}

export interface Unit {
  id: number;
  name: string;
}