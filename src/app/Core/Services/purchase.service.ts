import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Purchase, PurchaseMain, PurchaseMainCreate, Vendor, VendorItem } from '../models/purchase.model';
import { environment } from '../../../environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private apiUrl = `${environment.ROOT_API_URL}/purchase`;

  constructor(private http: HttpClient) { }

  getVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.apiUrl}/vendors`);
  }

  getVendorItems(vendorId: number): Observable<VendorItem[]> {
    return this.http.get<VendorItem[]>(`${this.apiUrl}/vendor-items/${vendorId}`);
  }

  createPurchase(purchase: PurchaseMainCreate): Observable<any> {
    return this.http.post(this.apiUrl, purchase);
  }

  getPurchase(id: number): Observable<PurchaseMain> {
    return this.http.get<PurchaseMain>(`${this.apiUrl}/${id}`);
  }
  getAllPurchases(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.apiUrl}`);
  }

  getPurchaseById(id: number): Observable<PurchaseMain> {
  return this.http.get<PurchaseMain>(`${this.apiUrl}/${id}`);
}

  updatePurchase(id: number, purchase: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, purchase);
  }
}