export interface PurchaseMain {
  id: number;
  voucherDate: Date;
  vendorId: number;
  paidAmount: number;
  prvBalance: number;
  currentAmount: number;
  branchId: number;
  userId:number;
  totalTpAmount:number;
  purchaseSubs: PurchaseSub[];
}

export interface PurchaseMainCreate {
  voucherDate: Date;
  vendorId: number;
  paidAmount: number;
  prvBalance: number;
  currentAmount: number;
  branchId: number;
  userId: number;
  purchaseSubs: PurchaseSubCreate[];
}

// purchase-sub.model.ts
export interface PurchaseSub {
  id: number;
  purchaseMainId: number;
  itemId: number;
  qty: number;
  rate: number;
  lineAmount: number;
  branchId: number;
  itemName?: string;
  productCode?: string;
}

export interface PurchaseSubCreate {
  itemId: number;
  qty: number;
  rate: number;
  lineAmount: number;
  branchId: number;
}


export interface Vendor {
id:number;
title: string;
previousBalance: number
}


export interface VendorItem {
  itemId: number;
  name: string;
  productCode: string;
  costPercent: number;
  tpRate: number;
  costRate: number;
  stockQty: number;
  unitName: string;
  categoryName: string;
}

export interface Purchase{
id: number;
  voucherDate: Date;
  vendorId: number;
  vendorName:string;
  paidAmount: number;
  prvBalance: number;
  currentAmount: number;
  branchId: number;
  userId:number;
}