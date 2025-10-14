// services/account.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  AccountCentral, 
  CreateAccountCentral, 
  AccountLedger, 
  AccountCategoriesDto,
  AccountStats 
} from '../models/account.model';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private apiUrl = environment.ROOT_API_URL;

  // Account Central Methods
  getAllAccounts(): Observable<AccountCentral[]> {
    return this.http.get<AccountCentral[]>(`${this.apiUrl}/accountcentral`);
  }

  getAccountById(accId: number): Observable<AccountCentral> {
    return this.http.get<AccountCentral>(`${this.apiUrl}/accountcentral/${accId}`);
  }

  createAccount(account: CreateAccountCentral): Observable<AccountCentral> {
    return this.http.post<AccountCentral>(`${this.apiUrl}/accountcentral`, account);
  }

  updateAccount(accId: number, account: CreateAccountCentral): Observable<AccountCentral> {
    return this.http.put<AccountCentral>(`${this.apiUrl}/accountcentral/${accId}`, account);
  }

  deleteAccount(accId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/accountcentral/${accId}`);
  }

  getAccountsByType(accountType: string): Observable<AccountCentral[]> {
    return this.http.get<AccountCentral[]>(`${this.apiUrl}/accountcentral/type/${accountType}`);
  }

  getAccountBalance(accId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/accountcentral/${accId}/balance`);
  }

  searchAccounts(term: string): Observable<AccountCentral[]> {
    return this.http.get<AccountCentral[]>(`${this.apiUrl}/accountcentral/search?term=${term}`);
  }

  getAccountStats(): Observable<AccountStats> {
    return this.http.get<AccountStats>(`${this.apiUrl}/accountcentral/stats`);
  }

  getAccountCategories(): Observable<AccountCategoriesDto[]> {
    return this.http.get<AccountCategoriesDto[]>(`${this.apiUrl}/accountcentral/accountcategories`);
  }

  // Account Ledger Methods
  getAccountLedgers(accId: number): Observable<AccountLedger[]> {
    return this.http.get<AccountLedger[]>(`${this.apiUrl}/accountledger/account/${accId}`);
  }

  createLedgerEntry(ledger: any): Observable<AccountLedger> {
    return this.http.post<AccountLedger>(`${this.apiUrl}/accountledger`, ledger);
  }
}