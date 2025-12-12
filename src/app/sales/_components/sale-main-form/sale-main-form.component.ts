import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectComponent } from '../../../Core/components/select/select.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SaleMen } from '../../../Core/models/sale.model';

@Component({
  selector: 'app-sale-main-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectComponent],
  templateUrl: './sale-main-form.component.html',
  styleUrl: './sale-main-form.component.scss'
})
export class SaleMainFormComponent {
@Input() form!: FormGroup;
@Input() saleMenArr:SaleMen[]=[];
@Input() previousBalance?:number=0;
@Output() salesManSelected=new EventEmitter<number>();

onSaleManSelected(salesman:SaleMen | null):void{
  this.salesManSelected.emit(salesman?.id);
}
}
