import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SaleReceiptCreate } from '../../../Core/models/sale.model';


@Component({
  selector: 'app-receipt-form',
  templateUrl: './receipt-form.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ReceiptFormComponent implements OnInit, OnChanges {
  @Input() invoiceId?: number;
  @Input() currentBalance: number = 0;
  @Input() accountId?: number;
  @Input() branchId: number = 1;
  @Input() userId: number = 1;
  @Input() isLoading: boolean = false;
  @Input() isVisible: boolean = false;
  
  @Output() save = new EventEmitter<SaleReceiptCreate>();
  @Output() skip = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  receiptForm: FormGroup;
  denominations = [
    { name: 'fiveThousands', label: '5000 Rs Notes', value: 5000, placeholder: '0' },
    { name: 'thousands', label: '1000 Rs Notes', value: 1000, placeholder: '0' },
    { name: 'fiveHundreds', label: '500 Rs Notes', value: 500, placeholder: '0' },
    { name: 'hundreds', label: '100 Rs Notes', value: 100, placeholder: '0' },
    { name: 'fifties', label: '50 Rs Notes', value: 50, placeholder: '0' },
    { name: 'twenties', label: '20 Rs Notes', value: 20, placeholder: '0' },
    { name: 'tens', label: '10 Rs Notes', value: 10, placeholder: '0' },
    { name: 'fives', label: '5 Rs Coins', value: 5, placeholder: '0' },
    { name: 'twos', label: '2 Rs Coins', value: 2, placeholder: '0' },
    { name: 'ones', label: '1 Rs Coins', value: 1, placeholder: '0' }
  ];

  paymentMethods = [
    { value: 'Cash', label: 'Cash' },
    { value: 'Card', label: 'Card' },
    { value: 'Bank Transfer', label: 'Bank Transfer' },
    { value: 'Cheque', label: 'Cheque' },
    { value: 'Digital Wallet', label: 'Digital Wallet' },
    { value: 'Bank Draft', label: 'Bank Draft' },
    { value: 'Online Payment', label: 'Online Payment' }
  ];

  constructor(private fb: FormBuilder) {
    this.receiptForm = this.createReceiptForm();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentBalance'] && !changes['currentBalance'].firstChange) {
      this.updateReceiptAmount();
    }
    
    if (changes['isVisible'] && this.isVisible) {
      this.initializeForm();
    }
  }

  private createReceiptForm(): FormGroup {
    return this.fb.group({
      receiptDate: [new Date().toISOString().split('T')[0], [Validators.required]],
      paymentMethod: ['Cash', [Validators.required]],
      totalAmount: [0, [Validators.required, Validators.min(0.01)]],
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
      notes: ['']
    });
  }

  private initializeForm(): void {
    if (this.receiptForm) {
      this.receiptForm.reset({
        receiptDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'Cash',
        totalAmount: Math.max(0, this.currentBalance),
        fiveThousands: 0,
        thousands: 0,
        fiveHundreds: 0,
        hundreds: 0,
        fifties: 0,
        twenties: 0,
        tens: 0,
        fives: 0,
        twos: 0,
        ones: 0,
        otherAmount: 0,
        notes: ''
      });
    }
  }

  updateReceiptAmount(): void {
    const currentTotal = this.receiptForm.get('totalAmount')?.value || 0;
    if (currentTotal === 0 || currentTotal > this.currentBalance) {
      this.receiptForm.patchValue({
        totalAmount: Math.max(0, this.currentBalance)
      });
    }
  }

  onDenominationChange(): void {
    let total = 0;
    
    // Calculate from denominations
    for (const denom of this.denominations) {
      const count = this.receiptForm.get(denom.name)?.value || 0;
      total += count * denom.value;
    }
    
    total += this.receiptForm.get('otherAmount')?.value || 0;
    
    this.receiptForm.patchValue({
      totalAmount: total
    }, { emitEvent: false });
  }

  onTotalAmountChange(): void {
    const totalAmount = this.receiptForm.get('totalAmount')?.value || 0;
    
    // Optional: Clear denominations when user manually changes total amount
    // this.clearDenominations();
    
    // Validate that amount doesn't exceed current balance (optional)
    if (totalAmount > this.currentBalance) {
      // You could show a warning here
    }
  }

  clearDenominations(): void {
    const patchValues: any = {};
    this.denominations.forEach(denom => {
      patchValues[denom.name] = 0;
    });
    patchValues['otherAmount'] = 0;
    
    this.receiptForm.patchValue(patchValues);
  }

  fillWithCurrentBalance(): void {
    this.receiptForm.patchValue({
      totalAmount: Math.max(0, this.currentBalance)
    });
  }

  fillFullPayment(): void {
    this.receiptForm.patchValue({
      totalAmount: this.currentBalance
    });
  }

  fillPartialPayment(percentage: number): void {
    const amount = (this.currentBalance * percentage) / 100;
    this.receiptForm.patchValue({
      totalAmount: Math.round(amount * 100) / 100 // Round to 2 decimal places
    });
  }

  hasDenominations(): boolean {
    const values = this.receiptForm.value;
    
    // Check if any denomination is filled
    const hasDenoms = this.denominations.some(denom => 
      values[denom.name] > 0
    );
    
    const hasOtherAmount = (values.otherAmount || 0) > 0;
    const hasTotalAmount = (values.totalAmount || 0) > 0;
    
    return hasDenoms || hasOtherAmount || hasTotalAmount;
  }

  getCalculatedTotal(): number {
    let total = 0;
    
    for (const denom of this.denominations) {
      const count = this.receiptForm.get(denom.name)?.value || 0;
      total += count * denom.value;
    }
    
    total += this.receiptForm.get('otherAmount')?.value || 0;
    return total;
  }

  isOverpayment(): boolean {
    const totalAmount = this.receiptForm.get('totalAmount')?.value || 0;
    return totalAmount > this.currentBalance;
  }

  getRemainingBalance(): number {
    const totalAmount = this.receiptForm.get('totalAmount')?.value || 0;
    return this.currentBalance - totalAmount;
  }

  onSave(): void {
    if (this.receiptForm.invalid) {
      this.markFormGroupTouched(this.receiptForm);
      
      if (!this.hasDenominations()) {
        alert('Please enter payment amount or add denominations.');
      }
      return;
    }

    if (!this.invoiceId || !this.accountId) {
      alert('Invoice or account information is missing.');
      return;
    }

    const totalAmount = this.receiptForm.get('totalAmount')?.value;
    
    if (totalAmount <= 0) {
      alert('Please enter a valid amount greater than 0.');
      return;
    }

    // Optional: Confirm overpayment
    if (this.isOverpayment()) {
      const confirmOverpayment = confirm(
        `Payment amount (Rs. ${totalAmount.toFixed(2)}) exceeds current balance (Rs. ${this.currentBalance.toFixed(2)}).\n` +
        `This will result in an advance payment of Rs. ${Math.abs(this.getRemainingBalance()).toFixed(2)}.\n\n` +
        `Do you want to proceed?`
      );
      
      if (!confirmOverpayment) {
        return;
      }
    }

    const receiptData: SaleReceiptCreate = {
      invoiceId: this.invoiceId,
      accId: this.accountId,
      receiptDate: new Date(this.receiptForm.get('receiptDate')?.value),
      totalAmount: totalAmount,
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
      branchId: this.branchId,
      userId: this.userId,
      //paymentMethod: this.receiptForm.get('paymentMethod')?.value
    };

    this.save.emit(receiptData);
  }

  onSkip(): void {
    this.skip.emit();
  }

  onClose(): void {
    this.close.emit();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}