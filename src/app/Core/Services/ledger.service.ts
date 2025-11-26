import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AccountLedger, BrandLedger } from '../models/ledger.model';
import { environment } from '../../../environment.prod';

@Injectable({
  providedIn: 'root'
})
export class LedgerService {
  private apiUrl = `${environment.ROOT_API_URL}/ledgers`;

  constructor(private http: HttpClient) { }

  getAccountLedger(accId: number, startDate: string, endDate: string): Observable<AccountLedger[]> {
    return this.http.get<AccountLedger[]>(
      `${this.apiUrl}/account/${accId}?startDate=${startDate}&endDate=${endDate}`
    );
  }

  getBrandLedger(itemId: number, startDate: string, endDate: string): Observable<BrandLedger[]> {
    return this.http.get<BrandLedger[]>(
      `${this.apiUrl}/brand/${itemId}?startDate=${startDate}&endDate=${endDate}`
    );
  }
}