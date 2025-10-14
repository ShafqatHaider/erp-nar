import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '../../Core/Services/account.service';
import { CodeService } from '../../Core/Services/code.service';
import { CodeCategory, CreateCodeItem } from '../../Core/models/code.model';
import { AccountCentral } from '../../Core/models/account.model';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './item-form.component.html'
})
export class ItemFormComponent implements OnInit {
  private codeService = inject(CodeService);
  private accountService = inject(AccountService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  itemForm: FormGroup;
  categories: CodeCategory[] = [];
  vendors: AccountCentral[] = [];
  isEdit = false;
  itemId: number | null = null;
  isLoading = false;
  isSubmitting = false;
  isCategoriesLoading = false;
  isVendorsLoading = false;

  // Mock units - in real app, fetch from API
  units = [
    { id: 1, name: 'Piece' },
    { id: 2, name: 'Kg' },
    { id: 3, name: 'Gram' },
    { id: 4, name: 'Liter' },
    { id: 5, name: 'Meter' },
    { id: 6, name: 'Box' },
    { id: 7, name: 'Pack' },
    { id: 8, name: 'Dozen' },
    { id: 9, name: 'Bottle' },
    { id: 10, name: 'Carton' }
  ];

  constructor() {
    this.itemForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      categoryId: ['', Validators.required],
      accId: ['', Validators.required],
      tpRates: [0, [Validators.required, Validators.min(0)]],
      costPrice: [0, [Validators.required, Validators.min(0)]],
      costPercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      salePrice: [0, [Validators.required, Validators.min(0)]],
      salePercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      stockQty: [0, [Validators.required, Validators.min(0)]],
      unitId: [1, Validators.required],
      productCode: [''],
      description: [''],
      branchId: [1, Validators.required], // Default branch
      userId: [1, Validators.required], // Default user
      isMostSoldItem: [0],
      isActive: [1]
    });
  }

  ngOnInit() {
    this.loadCategories();
    this.loadVendors();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.itemId = +params['id'];
        this.loadItem(this.itemId);
      }
    });

    // Calculate sale price when cost price or cost percent changes
    this.itemForm.get('costPrice')?.valueChanges.subscribe(() => this.calculateSalePrice());
    this.itemForm.get('costPercent')?.valueChanges.subscribe(() => this.calculateSalePrice());
    
    // Calculate cost percent when sale price changes
    this.itemForm.get('salePrice')?.valueChanges.subscribe(() => this.calculateCostPercent());
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

  loadItem(id: number) {
    this.isLoading = true;
    this.codeService.getItemById(id).subscribe({
      next: (item) => {
        this.itemForm.patchValue({
          name: item.name,
          categoryId: item.categoryId,
          accId: item.accId,
          tpRates: item.tpRates,
          costPrice: item.costPrice,
          costPercent: item.costPercent,
          salePrice: item.salePrice,
          salePercent: item.salePercent,
          stockQty: item.stockQty,
          unitId: item.unitId,
          productCode: item.productCode,
          description: item.description,
          branchId: item.branchId,
          userId: item.userId,
          isMostSoldItem: item.isMostSoldItem,
          isActive: item.isActive
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading item:', error);
        this.isLoading = false;
        alert('Error loading item details');
      }
    });
  }

  calculateSalePrice() {
    const costPrice = this.itemForm.get('costPrice')?.value || 0;
    const costPercent = this.itemForm.get('costPercent')?.value || 0;
    
    if (costPrice > 0 && costPercent > 0) {
      const salePrice = costPrice + (costPrice * costPercent / 100);
      this.itemForm.patchValue({
        salePrice: Math.round(salePrice * 100) / 100,
        salePercent: costPercent
      }, { emitEvent: false });
    }
  }

  calculateCostPercent() {
    const costPrice = this.itemForm.get('costPrice')?.value || 0;
    const salePrice = this.itemForm.get('salePrice')?.value || 0;
    
    if (costPrice > 0 && salePrice > 0) {
      const costPercent = ((salePrice - costPrice) / costPrice) * 100;
      this.itemForm.patchValue({
        costPercent: Math.round(costPercent * 100) / 100
      }, { emitEvent: false });
    }
  }

  onSubmit() {
    if (this.itemForm.valid) {
      this.isSubmitting = true;
      const formData: CreateCodeItem = this.itemForm.value;

      const operation = this.isEdit 
        ? this.codeService.updateItem(this.itemId!, formData)
        : this.codeService.createItem(formData);

      operation.subscribe({
        next: (item) => {
          this.router.navigate(['/codes/items']);
        },
        error: (error) => {
          console.error('Error saving item:', error);
          const errorMessage = error.error?.message || 'Error saving product';
          alert(errorMessage);
          this.isSubmitting = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.itemForm.controls).forEach(key => {
      this.itemForm.get(key)?.markAsTouched();
    });
  }

  getUnitName(unitId: number): string {
    return this.units.find(u => u.id === unitId)?.name || 'Unit';
  }
  goBack(){
    this.router.navigate(['/main/codes/items'])
  }
}