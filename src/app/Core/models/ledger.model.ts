export interface AccountLedger {
  lgId: number;
  entryDate: Date;
  description: string;
  refId: number;
  voucherType: string;
  folio: string;
  debit: number;
  credit: number;
  accountName: string;
  accId: number;
  branchId: number;
  userId: number;
}

export interface BrandLedger {
  lgId: number;
  entryDate: Date;
  voucherType: string;
  folio: string;
  refId: number;
  qtyIn: number;
  qtyOut: number;
  saleRate: number;
  costRate: number;
  branchId: number;
  userId: number;
  itemId: number;
  itemDesc: string;
  itemCode: string;
}