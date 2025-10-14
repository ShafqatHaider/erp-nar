// services/code.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environment';
import { CodeCategory, CodeItem, CreateCodeCategory, CreateCodeItem } from '../models/code.model';

@Injectable({
  providedIn: 'root'
})
export class CodeService {
  private http = inject(HttpClient);
  private apiUrl = environment.ROOT_API_URL;

  // CodeCategory Methods
  getCategories(): Observable<CodeCategory[]> {
    return this.http.get<CodeCategory[]>(`${this.apiUrl}/codecategory`);
  }

  getCategoryById(id: number): Observable<CodeCategory> {
    return this.http.get<CodeCategory>(`${this.apiUrl}/codecategory/${id}`);
  }

  createCategory(category: CreateCodeCategory): Observable<CodeCategory> {
    return this.http.post<CodeCategory>(`${this.apiUrl}/codecategory`, category);
  }

  updateCategory(id: number, category: CreateCodeCategory): Observable<CodeCategory> {
    return this.http.put<CodeCategory>(`${this.apiUrl}/codecategory/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/codecategory/${id}`);
  }

  getCategoryItems(categoryId: number): Observable<CodeItem[]> {
    return this.http.get<CodeItem[]>(`${this.apiUrl}/codecategory/${categoryId}/items`);
  }

  // CodeItems Methods
  getItems(): Observable<CodeItem[]> {
    return this.http.get<CodeItem[]>(`${this.apiUrl}/codeitems`);
  }

  getItemById(id: number): Observable<CodeItem> {
    return this.http.get<CodeItem>(`${this.apiUrl}/codeitems/${id}`);
  }

  createItem(item: CreateCodeItem): Observable<CodeItem> {
    return this.http.post<CodeItem>(`${this.apiUrl}/codeitems`, item);
  }

  updateItem(id: number, item: CreateCodeItem): Observable<CodeItem> {
    return this.http.put<CodeItem>(`${this.apiUrl}/codeitems/${id}`, item);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/codeitems/${id}`);
  }

  getMostSoldItems(): Observable<CodeItem[]> {
    return this.http.get<CodeItem[]>(`${this.apiUrl}/codeitems/most-sold`);
  }

  getItemsByCategory(categoryId: number): Observable<CodeItem[]> {
    return this.http.get<CodeItem[]>(`${this.apiUrl}/codeitems/category/${categoryId}`);
  }

  searchItems(term: string): Observable<CodeItem[]> {
    return this.http.get<CodeItem[]>(`${this.apiUrl}/codeitems/search?term=${term}`);
  }

  getLowStockItems(): Observable<CodeItem[]> {
    return this.http.get<CodeItem[]>(`${this.apiUrl}/codeitems/low-stock`);
  }
}