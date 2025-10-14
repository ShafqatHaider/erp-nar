// models/account.models.ts
export interface AccountCentral {
  accId: number;
  entryDate: string;
  cateAccId: number;
  title: string;
  isActive: number;
  openingBalance: number;
  balanceType: number;
  accountType: string;
  accountCategory?: AccountCategory;
  accountLedgers?: AccountLedger[];
}

export interface AccountCategory {
  cateAccId: number;
  cateAccName: string;
}

export interface AccountLedger {
  lgId: number;
  entryDate: string;
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

export interface CreateAccountCentral {
  cateAccId: number;
  title: string;
  isActive: number;
  openingBalance: number;
  balanceType: number;
  accountType: string;
}

export interface AccountCategoriesDto {
  cateAccId: number;
  cateAccName: string;
}

export interface AccountStats {
  totalAccounts: number;
  accountsByType: Array<{
    type: string;
    count: number;
    totalBalance: number;
  }>;
  recentAccounts: AccountCentral[];
}