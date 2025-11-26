import { Injectable } from "@angular/core";
import { environment } from "../../../environment.prod";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CreateSaleMain, SaleItem , SaleMain, SaleMen, SaleReceipt, SaleReceiptCreate} from "../models/sale.model";


@Injectable({
    providedIn:'root'
})

export class SaleService{

    private apiUrl =`${environment.ROOT_API_URL}/Sales`;

    constructor(private http:HttpClient){}


    getSaleItems():Observable<SaleItem[]>{
        return this.http.get<SaleItem[]>(`${this.apiUrl}/sale-items`);
    }

    getSaleMen():Observable<SaleMen[]>
    {
        return this.http.get<SaleMen[]>(`${this.apiUrl}/sale-men`)
    }

    getSales(startDate: string, endDate: string): Observable<SaleMain[]> {
    return this.http.get<SaleMain[]>(`${this.apiUrl}?startDate=${startDate}&endDate=${endDate}`);
  }

  getSaleById(id: number): Observable<SaleMain> {
    return this.http.get<SaleMain>(`${this.apiUrl}/${id}`);
  }

  createSale(sale: CreateSaleMain): Observable<SaleMain> {
    return this.http.post<SaleMain>(this.apiUrl, sale);
  }

  updateSale(id: number, sale: CreateSaleMain): Observable<SaleMain> {
    return this.http.put<SaleMain>(`${this.apiUrl}/${id}`, sale);
  }

  deleteSale(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addReceipt(receipt: SaleReceiptCreate): Observable<SaleReceipt> {
    return this.http.post<SaleReceipt>(`${this.apiUrl}/receipt`, receipt);
  }

  getReceiptsByInvoice(invoiceId: number): Observable<SaleReceipt[]> {
    return this.http.get<SaleReceipt[]>(`${this.apiUrl}/${invoiceId}/receipts`);
  }




}
