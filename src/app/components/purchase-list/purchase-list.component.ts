import { Component, Inject, inject, OnInit } from '@angular/core';
import { PurchaseService } from '../../Core/Services/purchase.service';
import { AccountService } from '../../Core/Services/account.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Purchase, Vendor } from '../../Core/models/purchase.model';
import { CommonModule, DatePipe } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-purchase-list',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './purchase-list.component.html',
  styleUrl: './purchase-list.component.scss'
})
export class PurchaseListComponent implements OnInit {
  private purchaseService = inject(PurchaseService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  purchase: Purchase[] = [];
  filteredItems: Purchase[] = [];
  vendors: Vendor[] = [];
  isLoading = true;
  isCategoriesLoading = false;
  isVendorsLoading = false;
  searchForm: FormGroup;
  lowStockItems=0;
  regularItems=0;
  outOfStockItems=0;
  

  constructor() {
    this.searchForm = this.fb.group({
      search: [''],
      vendor: [''],
      dateInput : ['']
      });
  }

  ngOnInit() {
    this.loadItems();
    this.loadVendors();
    
    this.searchForm.valueChanges.subscribe(value => {
      this.filterItems(value);
    });

    
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.searchForm.patchValue({
          category: +params['category']
        });
      }
    });


  }
  loadItems() {
    this.isLoading = true;
    this.purchaseService.getAllPurchases().subscribe({
      next: (items) => {
        this.purchase = items;
        this.filteredItems = items;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading items:', error);
        this.isLoading = false;
      }
    });
  }

  
  loadVendors() {
    this.isVendorsLoading = true;
    this.purchaseService.getVendors().subscribe({
      next: (vendors) => {
        this.vendors = vendors;
        this.isVendorsLoading = false;
      },
      error: (error) => {
        console.error('Error loading vendors:', error);
        this.isVendorsLoading = false;
      }
    });
  }

private pipe = Inject(DatePipe);

  filterItems(filters: any) {
    debugger
  let filtered = [...this.purchase]; 

  const search = filters.search?.toLowerCase() || '';
  const vendor = filters.vendor || '';
  const fdate = filters.dateInput || '';
  


  if (search) {
    debugger
    filtered = filtered.filter(item => {
      const vendorName = item.vendorName.toLowerCase();
      const ids = item.id.toString();
    

      return vendorName.includes(search) || ids.includes(search);
    });
  }

 if (fdate) {
  filtered = filtered.filter(item => {
    if (!item.voucherDate) return false;
    const itemDate = new Date(item.voucherDate).toISOString().split('T')[0];
    return itemDate === fdate;
  });
}

  if (vendor) {
    filtered = filtered.filter(item => item.vendorName === vendor);
  }

  this.filteredItems = filtered;
}


  // deleteItem(id: number) {
  //   if (confirm('Are you sure you want to delete this item?')) {
  //     this.purchaseService.deleteItem(id).subscribe({
  //       next: () => {
  //         this.items = this.items.filter(i => i.id !== id);
  //         this.filteredItems = this.filteredItems.filter(i => i.id !== id);
  //       },
  //       error: (error) => {
  //         console.error('Error deleting item:', error);
  //         alert('Error deleting item');
  //       }
  //     });
  //   }
  // }

  getStockStatus(stockQty: number): { text: string, color: string } {
    if (stockQty === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (stockQty <= 10) return { text: 'Low Stock', color: 'bg-orange-100 text-orange-800' };
    return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
  }

 


  createProduct(){
    this.router.navigate(['/purchases/create']);
    
  }
}