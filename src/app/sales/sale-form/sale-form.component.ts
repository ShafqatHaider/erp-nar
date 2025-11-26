
import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SaleService } from '../../Core/Services/sale.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CreateSaleMain, SaleItem, SaleMen, SaleReceiptCreate } from '../../Core/models/sale.model';

@Component({
  selector: 'app-sale-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule],
  templateUrl: './sale-form.component.html',
  styleUrl: './sale-form.component.scss'
})
export class SaleFormComponent implements OnInit {
  saleForm: FormGroup;
  receiptForm: FormGroup;
  isEdit = false;
  saleId?: number;
  loading = false;
  submitting = false;
  saleMenArr: SaleMen[] = [];
  saleItemsArr: SaleItem[] = [];
  isLoading = false;
  showReceiptSection = false;
  isSavingReceipt = false;
  createdSaleId?: number;

  @ViewChildren('qtyInput') qtyInputs!: QueryList<ElementRef>;

  constructor(
    private fb: FormBuilder,
    private saleService: SaleService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.saleForm = this.createSaleForm();
    this.receiptForm = this.createReceiptForm();
  }

  // Getter for sale items FormArray
  get saleItems(): FormArray {
    return this.saleForm.get('saleItems') as FormArray;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.saleId = +params['id'];
        this.loadSale();
      }
    });
    this.init();
  }
loadSale(): void {
  if (!this.saleId) return;
  
  this.loading = true;
  this.saleService.getSaleById(this.saleId).subscribe({
    next: (sale) => {
      this.saleForm.patchValue({
        billDate: sale.billDate.toString().split('T')[0],
        accId: sale.accId,
        accName: sale.accName,
        branchId: sale.branchId,
        userId: sale.userId
      });

      // If you want to load existing sale items into grid
      // You'll need to implement this based on your data structure
      
      this.loading = false;
    },
    error: (error) => {
      console.error('Error loading sale:', error);
      this.loading = false;
    }
  });
}

 getGridTotalAmount(): number {
    return this.saleItems.controls.reduce((total, item) => {
      return total + (item.get('lineAmount')?.value || 0);
    }, 0);
  }

  createSaleForm(): FormGroup {
    return this.fb.group({
      billDate: [new Date().toISOString().split('T')[0], Validators.required],
      accId: ['', Validators.required],
      accName: ['', Validators.required],
      branchId: [1, Validators.required],
      userId: [1, Validators.required],
      saleItems: this.fb.array([]),
      saleSubs: this.fb.array([])
    });
  }

  createReceiptForm(): FormGroup {
    return this.fb.group({
      receiptDate: [new Date().toISOString().split('T')[0], Validators.required],
      totalAmount: [0, [Validators.required, Validators.min(0)]],
      // Denomination breakdown
      fiveThousands: [0, [Validators.min(0)]],
      thousands: [0, [Validators.min(0)]],
      fiveHundreds: [0, [Validators.min(0)]],
      hundreds: [0, [Validators.min(0)]],
      fifties: [0, [Validators.min(0)]],
      twenties: [0, [Validators.min(0)]],
      tens: [0, [Validators.min(0)]],
      fives: [0, [Validators.min(0)]],
      twos: [0, [Validators.min(0)]],
      ones: [0, [Validators.min(0)]],
      otherAmount: [0, [Validators.min(0)]],
      notes: [''],
      paymentMethod: ['Cash', Validators.required]
    });
  }

  init() {
    this.isLoading = true;
    
    this.saleService.getSaleMen().subscribe({
      next: (res) => {
        this.saleMenArr = res;
      },
      error: (error) => {
        console.error('Error loading sale men:', error);
        this.isLoading = false;
      }
    });

    this.saleService.getSaleItems().subscribe({
      next: (res) => {
        this.saleItemsArr = res;
        this.populateItemsGrid(this.saleItemsArr);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading sale items:', error);
        this.isLoading = false;
      }
    });
  }

  populateItemsGrid(arr: any[]): void {
    this.saleItems.clear();
    
    arr.forEach(item => {
      const itemGroup = this.fb.group({
        itemId: [item.id || item.itemId],
        itemName: [item.name || item.itemName],
        productCode: [item.productCode || ''],
        lastPurchaseRate: [item.tpRate || 0],
        currentStock: [item.currentStock || item.salePercent || 0],
        qty: [0, [Validators.min(0)]],
        rate: [item.salePrice || item.rate || 0],
        lineAmount: [0],
        tpTotal: [0],
        percentage: [item.percentage || 0],
        transType: ['Sale']
      });

      itemGroup.get('qty')?.valueChanges.subscribe(() => this.calculateLineAmount(itemGroup));
      itemGroup.get('rate')?.valueChanges.subscribe(() => this.calculateLineAmount(itemGroup));
      itemGroup.get('lastPurchaseRate')?.valueChanges.subscribe(() => this.calculateLineAmount(itemGroup));
      itemGroup.get('percentage')?.valueChanges.subscribe(() => this.calculateLineAmount(itemGroup));

      this.saleItems.push(itemGroup);
    });
  }

  calculateLineAmount(itemGroup: FormGroup): void {
    const qty = itemGroup.get('qty')?.value || 0;
    const rate = itemGroup.get('rate')?.value || 0;
    const percentage = itemGroup.get('percentage')?.value || 0;
    
    const tpRate = itemGroup.get('lastPurchaseRate')?.value || 0;
    const tRate = tpRate - (percentage / 100 * tpRate);
    
    const lineAmount = qty * (rate > 0 ? rate : tRate);
    
    itemGroup.get('lineAmount')?.setValue(lineAmount, { emitEvent: false });
    itemGroup.get('tpTotal')?.setValue(qty * tpRate, { emitEvent: false });
  }

  getSelectedItemsCount(): number {
    return this.saleItems.controls.filter(control => 
      (control.get('qty')?.value || 0) > 0
    ).length;
  }

  hasItemsWithQuantity(): boolean {
    return this.getSelectedItemsCount() > 0;
  }

  getTotalAmount(): number {
    return this.saleItems.controls.reduce((total, item) => {
      return total + (item.get('lineAmount')?.value || 0);
    }, 0);
  }

  // Calculate total from denominations
  calculateDenominationTotal(): number {
    const form = this.receiptForm.value;
    return (
      (form.fiveThousands * 5000) +
      (form.thousands * 1000) +
      (form.fiveHundreds * 500) +
      (form.hundreds * 100) +
      (form.fifties * 50) +
      (form.twenties * 20) +
      (form.tens * 10) +
      (form.fives * 5) +
      (form.twos * 2) +
      (form.ones * 1) +
      (form.otherAmount || 0)
    );
  }

  // Update receipt total when denominations change
  onDenominationChange(): void {
    const total = this.calculateDenominationTotal();
    this.receiptForm.patchValue({
      totalAmount: total
    });
  }

  // Check if any denomination is filled
  hasDenominations(): boolean {
    const form = this.receiptForm.value;
    return (
      form.fiveThousands > 0 ||
      form.thousands > 0 ||
      form.fiveHundreds > 0 ||
      form.hundreds > 0 ||
      form.fifties > 0 ||
      form.twenties > 0 ||
      form.tens > 0 ||
      form.fives > 0 ||
      form.twos > 0 ||
      form.ones > 0 ||
      form.otherAmount > 0
    );
  }

  onSubmit(): void {
    if (this.saleForm.valid && this.hasItemsWithQuantity()) {
      this.submitting = true;
      
      const selectedItems = this.saleItems.controls
        .filter(control => (control.get('qty')?.value || 0) > 0)
        .map(control => ({
          itemId: control.get('itemId')?.value,
          itemName: control.get('itemName')?.value,
          description: control.get('description')?.value || '',
          tpRate: control.get('lastPurchaseRate')?.value,
          percentage: control.get('percentage')?.value,
          qty: control.get('qty')?.value,
          transType: control.get('transType')?.value
        }));

      const formValue = this.saleForm.value;
      const saleData: CreateSaleMain = {
        ...formValue,
        billDate: new Date(formValue.billDate),
        saleSubs: selectedItems,
        totalBill: this.getTotalAmount()
      };

      const operation = this.isEdit && this.saleId
        ? this.saleService.updateSale(this.saleId, saleData)
        : this.saleService.createSale(saleData);

      operation.subscribe({
        next: (sale) => {
          this.submitting = false;
          this.createdSaleId = sale.id;
          this.showReceiptSection = true;
          
          // Initialize receipt form with sale data
          this.receiptForm.patchValue({
            totalAmount: this.getTotalAmount()
          });
          
          // Scroll to receipt section
          setTimeout(() => {
            document.getElementById('receipt-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        },
        error: (error) => {
          console.error('Error saving sale:', error);
          this.submitting = false;
          alert('Error saving sale. Please try again.');
        }
      });
    } else {
      this.markFormGroupTouched(this.saleForm);
      if (!this.hasItemsWithQuantity()) {
        alert('Please add quantity to at least one item.');
      }
    }
  }

  onSaveReceipt(): void {
    if (this.receiptForm.valid && this.hasDenominations() && this.createdSaleId) {
      this.isSavingReceipt = true;

      const receiptData: SaleReceiptCreate = {
        invoiceId: this.createdSaleId,
        accId: this.saleForm.get('accId')?.value,
        receiptDate: new Date(this.receiptForm.get('receiptDate')?.value),
        totalAmount: this.receiptForm.get('totalAmount')?.value,
        ones: this.receiptForm.get('ones')?.value,
        twos: this.receiptForm.get('twos')?.value,
        fives: this.receiptForm.get('fives')?.value,
        tens: this.receiptForm.get('tens')?.value,
        twenties: this.receiptForm.get('twenties')?.value,
        fifties: this.receiptForm.get('fifties')?.value,
        hundreds: this.receiptForm.get('hundreds')?.value,
        thousands: this.receiptForm.get('thousands')?.value,
        fiveThousands: this.receiptForm.get('fiveThousands')?.value,
        otherAmount: this.receiptForm.get('otherAmount')?.value,
        notes: this.receiptForm.get('notes')?.value,
        branchId: this.saleForm.get('branchId')?.value,
        userId: this.saleForm.get('userId')?.value
      };

      this.saleService.addReceipt(receiptData).subscribe({
        next: (receipt) => {
          this.isSavingReceipt = false;
          alert('Receipt saved successfully!');
          this.router.navigate(['/sales', this.createdSaleId]);
        },
        error: (error) => {
          console.error('Error saving receipt:', error);
          this.isSavingReceipt = false;
          alert('Error saving receipt. Please try again.');
        }
      });
    } else {
      if (!this.hasDenominations()) {
        alert('Please add at least one denomination or use Other Amount field.');
      }
      this.markFormGroupTouched(this.receiptForm);
    }
  }

  onSkipReceipt(): void {
    if (this.createdSaleId) {
      this.router.navigate(['/sales', this.createdSaleId]);
    } else {
      this.router.navigate(['/sales']);
    }
  }

  selectAll(event: any) {
    event.target.select();
  }

  focusNextQty(index: number) {
    const inputs = this.qtyInputs.toArray();
    if (inputs[index + 1]) {
      inputs[index + 1].nativeElement.focus();
      inputs[index + 1].nativeElement.select();
    }
  }

  focusPrevQty(index: number) {
    const inputs = this.qtyInputs.toArray();
    if (inputs[index - 1]) {
      inputs[index - 1].nativeElement.focus();
      inputs[index - 1].nativeElement.select();
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(subControl => {
          if (subControl instanceof FormGroup) {
            this.markFormGroupTouched(subControl);
          } else {
            subControl.markAsTouched();
          }
        });
      } else {
        control?.markAsTouched();
      }
    });
  }
}