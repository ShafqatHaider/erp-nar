import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../../Core/Services/account.service';
import { CodeService } from '../../Core/Services/code.service';
import { CodeCategory, CodeItem } from '../../Core/models/code.model';
import { AccountCentral } from '../../Core/models/account.model';


@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './item-list.component.html'
})
export class ItemListComponent implements OnInit {
  private codeService = inject(CodeService);
  private accountService = inject(AccountService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  items: CodeItem[] = [];
  filteredItems: CodeItem[] = [];
  categories: CodeCategory[] = [];
  vendors: AccountCentral[] = [];
  isLoading = true;
  isCategoriesLoading = false;
  isVendorsLoading = false;
  searchForm: FormGroup;
  lowStockItems=0;
  regularItems=0;
  outOfStockItems=0;
  // Mock units - in real app, fetch from API
  units = [
    { id: 1, name: 'Piece' },
    { id: 2, name: 'Kg' },
    { id: 3, name: 'Gram' },
    { id: 4, name: 'Liter' },
    { id: 5, name: 'Meter' },
    { id: 6, name: 'Box' },
    { id: 7, name: 'Pack' }
  ];

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
    this.loadCategories();
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

this.updateCounts();
  }
  updateCounts(){
  this.updateLowStockCount(); 
  this.updateReqularItemsCount();
  this.updateOutOfStockCount();

}
updateLowStockCount() {
  this.lowStockItems = this.items ? this.items.filter(i => i.stockQty <= 10).length : 0;
}
 
updateOutOfStockCount() {
  this.outOfStockItems = this.items ? this.items.filter(i => i.stockQty === 0).length : 0;
}

updateReqularItemsCount(){
  this.regularItems=this.items ? this.items.filter(i => i.isMostSoldItem !== 1).length : 0;
}
  loadItems() {
    this.isLoading = true;
    this.codeService.getItems().subscribe({
      next: (items) => {
        this.items = items;
        this.filteredItems = items;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading items:', error);
        this.isLoading = false;
      }
    });
  }

  loadCategories() {
    this.isCategoriesLoading = true;
    this.codeService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isCategoriesLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.isCategoriesLoading = false;
      }
    });
  }

  loadVendors() {
    this.isVendorsLoading = true;
    this.accountService.getAccountsByType('Vendor').subscribe({
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
    let filtered = this.items;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchLower) ||
        item.productCode.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.categoryName?.toLowerCase().includes(searchLower) ||
        item.brandName?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.category) {
      filtered = filtered.filter(item => item.categoryId === +filters.category);
    }

    if (filters.vendor) {
      filtered = filtered.filter(item => item.accId === +filters.vendor);
    }

    if (filters.lowStock) {
      filtered = filtered.filter(item => item.stockQty <= 10);
    }

    this.filteredItems = filtered;
  }

  deleteItem(id: number) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.codeService.deleteItem(id).subscribe({
        next: () => {
          this.items = this.items.filter(i => i.id !== id);
          this.filteredItems = this.filteredItems.filter(i => i.id !== id);
        },
        error: (error) => {
          console.error('Error deleting item:', error);
          alert('Error deleting item');
        }
      });
    }
  }

  getStockStatus(stockQty: number): { text: string, color: string } {
    if (stockQty === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (stockQty <= 10) return { text: 'Low Stock', color: 'bg-orange-100 text-orange-800' };
    return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
  }

  getUnitName(unitId: number): string {
    return this.units.find(u => u.id === unitId)?.name || 'Unit';
  }

  toggleMostSold(item: CodeItem) {
    const updatedItem = {
      ...item,
      isMostSoldItem: item.isMostSoldItem ? 0 : 1
    };
    
    this.codeService.updateItem(item.id, updatedItem).subscribe({
      next: () => {
        item.isMostSoldItem = updatedItem.isMostSoldItem;
      },
      error: (error) => {
        console.error('Error updating item:', error);
        alert('Error updating item');
      }
    });
  }


  createProduct(){
    this.router.navigate(['/codes/items/create']);
    
  }
}