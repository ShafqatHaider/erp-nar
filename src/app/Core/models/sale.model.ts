export interface SaleItem{
    itemId:  number;
    name:  string;
    productCode:  string;
    tpRate:  number;
    salePercent:  number;
    salePrice:  number;
    stockQty:  number;
    unitName:  string; 
    categoryName:  string;
}


export interface SaleMen {
id:number;
title: string;
previousBalance: number
}

export interface SaleMain {
  id: number;
  billDate: Date;
  accId: number;
  accName: string;
  totalBill: number;
  branchId: number;
  userId: number;
  saleSubs: SaleSub[];
  saleReceipts: SaleReceipt[];
}

export interface SaleSub {
  id: number;
  saleMainId: number;
  itemId: number;
  itemName: string;
  description: string;
  tpRate: number;
  percentage: number;
  tRate: number;
  qty: number;
  transType: string;
  lineAmount: number;
  returnAmount: number;
}

export interface SaleReceipt {
  id: number;
  invoiceId: number;
  accId: number;
  receiptDate: Date;
  totalAmount: number;
  ones: number;
  twos: number;
  fives: number;
  tens: number;
  twenties: number;
  fifties: number;
  hundreds: number;
  thousands: number;
  fiveThousands: number;
  otherAmount: number;
  notes?: string;
  branchId: number;
  userId: number;
}

export interface CreateSaleMain {
  billDate: Date;
  accId: number;
  accName: string;
  branchId: number;
  userId: number;
  saleSubs: CreateSaleSub[];
}

export interface CreateSaleSub {
  itemId: number;
  itemName: string;
  description: string;
  tpRate: number;
  percentage: number;
  qty: number;
  transType: string;
}

export interface SaleReceiptCreate {
  invoiceId: number;
  accId: number;
  receiptDate: Date;
  totalAmount: number;
  ones: number;
  twos: number;
  fives: number;
  tens: number;
  twenties: number;
  fifties: number;
  hundreds: number;
  thousands: number;
  fiveThousands: number;
  otherAmount: number;
  notes?: string;
  branchId: number;
  userId: number;
}