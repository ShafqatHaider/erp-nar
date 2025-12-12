import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren, viewChildren } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../../Core/components/loading-spinner/loading-spinner.component';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-sale-items-grid',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe, LoadingSpinnerComponent],
  templateUrl: './sale-items-grid.component.html',
  styleUrl: './sale-items-grid.component.scss'
})
export class SaleItemsGridComponent {

@Input() saleItems!: FormArray;
  @Input() isLoading = false;
  @Output() amountCalculated = new EventEmitter<number>();

  @ViewChildren('qtyInput') qtyInputs!: QueryList<ElementRef>;

  getItemGroup(index: number): FormGroup {
    return this.saleItems.at(index) as FormGroup;
  }

  getSelectedItemsCount(): number {
    return this.saleItems.controls.filter(control => 
      (control.get('qty')?.value || 0) > 0
    ).length;
  }

  getTotalAmount(): number {
    const total = this.saleItems.controls.reduce((total, item) => {
      return total + (item.get('lineAmount')?.value || 0);
    }, 0);
    this.amountCalculated.emit(total);
    return total;
  }

  selectAll(element: HTMLInputElement): void {
    element.select();
  }

  focusNextQty(index: number): void {
    const inputs = this.qtyInputs.toArray();
    if (inputs[index + 1]) {
      inputs[index + 1].nativeElement.focus();
      inputs[index + 1].nativeElement.select();
    }
  }

  focusPrevQty(index: number): void {
    const inputs = this.qtyInputs.toArray();
    if (inputs[index - 1]) {
      inputs[index - 1].nativeElement.focus();
      inputs[index - 1].nativeElement.select();
    }
  }

}
