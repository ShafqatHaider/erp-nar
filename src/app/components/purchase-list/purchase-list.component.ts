import { Component, inject, OnInit } from '@angular/core';
import { PurchaseService } from '../../Core/Services/purchase.service';
import { AccountService } from '../../Core/Services/account.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Purchase, Vendor } from '../../Core/models/purchase.model';
import { CommonModule } from '@angular/common';

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
      category: [''],
      vendor: [''],
      lowStock: [false]
    });
  }

  ngOnInit() {
    this.loadItems();
    this.loadVendors();
    
    this.searchForm.valueChanges.subscribe(value => {
      this.filterItems(value);
    });

    // Check for category filter from URL
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.searchForm.patchValue({
          category: +params['category']
        });
      }
    });

// this.updateCounts();
  }
//   updateCounts(){
//   this.updateLowStockCount(); 
//   this.updateReqularItemsCount();
//   this.updateOutOfStockCount();

// }
// updateLowStockCount() {
//   this.lowStockItems = this.purchase ? this.purchase.filter(i => i. <= 10).length : 0;
// }
 
// updateOutOfStockCount() {
//   this.outOfStockItems = this.items ? this.items.filter(i => i.stockQty === 0).length : 0;
// }

// updateReqularItemsCount(){
//   this.regularItems=this.items ? this.items.filter(i => i.isMostSoldItem !== 1).length : 0;
// }
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

  filterItems(filters: any) {
    let filtered = this.purchase;

    if (filters.search) {
      debugger
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.vendorId.toString().includes(searchLower) ||
        item.voucherDate.toISOString().includes(searchLower) 
        
      )
    }

    if (filters.vendorId) {
      filtered = filtered.filter(item => item.vendorId === +filters.vendorId);
    }

    if (filters.voucherDate) {
      filtered = filtered.filter(item => item.voucherDate == filters.voucherDate);
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