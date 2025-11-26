import { Component, OnInit } from '@angular/core';
import { SaleService } from '../../Core/Services/sale.service';
import { SaleMain } from '../../Core/models/sale.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-sale-list',
  standalone:true,
  imports:[FormsModule, CommonModule, RouterLink],
  templateUrl: './sale-list.component.html',
})
export class SaleListComponent implements OnInit {
  sales: SaleMain[] = [];
  loading = false;
  startDate: string;
  endDate: string;

  constructor(private saleService: SaleService) {
    const today = new Date();
    this.endDate = today.toISOString().split('T')[0];
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    this.startDate = start.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(): void {
    this.loading = true;
    this.saleService.getSales(this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.sales = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading sales:', error);
        this.loading = false;
      }
    });
  }

  deleteSale(id: number): void {
    if (confirm('Are you sure you want to delete this sale?')) {
      this.saleService.deleteSale(id).subscribe({
        next: () => {
          this.sales = this.sales.filter(s => s.id !== id);
        },
        error: (error) => {
          console.error('Error deleting sale:', error);
          alert('Error deleting sale. It might have receipts attached.');
        }
      });
    }
  }

  calculateTotal(sale: SaleMain): number {
    return sale.saleSubs.reduce((total, sub) => total + sub.lineAmount, 0);
  }
}