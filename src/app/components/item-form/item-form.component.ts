import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CodeService } from '../../Core/Services/code.service';
import { AccountService } from '../../Core/Services/account.service';
import { AccountCentral } from '../../Core/models/account.model';
import { CodeCategory, CreateCodeItem } from '../../Core/models/code.model';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent implements OnInit {
  private codeService = inject(CodeService);
  private accountService = inject(AccountService);
  private fb = inject(FormBuilder);
  public router = inject(Router);
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
      costPercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      costPrice: [{ value: 0, disabled: true }], // Auto-calculated, read-only
      salePercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      salePrice: [{ value: 0, disabled: true }], // Auto-calculated, read-only
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

    // Calculate prices when TP Rates or percentages change
    this.itemForm.get('tpRates')?.valueChanges.subscribe(() => this.calculatePrices());
    this.itemForm.get('costPercent')?.valueChanges.subscribe(() => this.calculatePrices());
    this.itemForm.get('salePercent')?.valueChanges.subscribe(() => this.calculatePrices());
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
          costPercent: item.costPercent,
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
        
        // Calculate prices based on loaded data
        this.calculatePrices();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading item:', error);
        this.isLoading = false;
        alert('Error loading item details');
      }
    });
  }


  calculatePrices() {
    const tpRates = this.itemForm.get('tpRates')?.value || 0;
    const costPercent = this.itemForm.get('costPercent')?.value || 0;
    const salePercent = this.itemForm.get('salePercent')?.value || 0;

    // Calculate Cost Price: TP Rates - (TP Rates * costPercent / 100)
    const costPrice = tpRates - (tpRates * costPercent / 100);
    
    // Calculate Sale Price: TP Rates - (TP Rates * salePercent / 100)
    const salePrice = tpRates - (tpRates * salePercent / 100);

    // Update form values without triggering events
    this.itemForm.patchValue({
      costPrice: Math.round(costPrice * 100) / 100,
      salePrice: Math.round(salePrice * 100) / 100
    }, { emitEvent: false });
  }

  onSubmit() {
    debugger
    if (this.itemForm.valid) {
      this.isSubmitting = true;
      
      // Get the calculated values for submission
      const formData: CreateCodeItem = {
        ...this.itemForm.getRawValue(), // This includes disabled fields
        costPrice: this.itemForm.get('costPrice')?.value,
        salePrice: this.itemForm.get('salePrice')?.value,
        isActive:this.itemForm.get('isActive')?.value,
        isMostSoldItem: this.itemForm.get('isMostSoldItem')?.value ? 1:0
      };

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

  // Helper method to calculate profit margin
  calculateProfitMargin(): number {
    const costPrice = this.itemForm.get('costPrice')?.value || 0;
    const salePrice = this.itemForm.get('salePrice')?.value || 0;
    
    if (costPrice > 0 && salePrice > costPrice) {
      return ((salePrice - costPrice) / costPrice) * 100;
    }
    return 0;
  }
}