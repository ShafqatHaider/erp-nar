import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Vendor, VendorItem, Purchase, PurchaseMainCreate, PurchaseMain } from '../../Core/models/purchase.model';
import { PurchaseService } from '../../Core/Services/purchase.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-purchase',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.scss'
})
export class PurchaseComponent implements OnInit {
  isEdit: boolean = false;
  purchaseForm: FormGroup;
  vendors: Vendor[] = [];
  vendorItems: VendorItem[] = [];
  selectedVendorItems: VendorItem[] = [];
  isSubmitting = false;
  purchaseId: number | null = null;
  originalPurchase: PurchaseMain | null = null;
createPurchase:PurchaseMainCreate | null=null;
isLoading = false;
@ViewChildren('qtyInput') qtyInputs!: QueryList<ElementRef>;

  constructor(
    private fb: FormBuilder,
    private purchaseService: PurchaseService,
    private route: ActivatedRoute,
    private router: Router,
    private pipe:DatePipe,
    private toastService: ToastrService
  ) {
    this.purchaseForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadVendors();
    this.getPurchaseId();
  }

  getPurchaseId(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.isEdit=true;
        this.purchaseId = +id;
        this.loadPurchaseData(this.purchaseId);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      voucherDate: [new Date().toISOString().substring(0, 10), Validators.required],
      vendorId: Number([null, Validators.required]),
      paidAmount: [0, [Validators.required, Validators.min(0)]],
      prvBalance: [0, [Validators.required, Validators.min(0)]],
      currentAmount: [0, [Validators.required, Validators.min(0)]],
      branchId: [1, Validators.required],
      userId: [1, Validators.required],
      purchaseItems: this.fb.array([])
    });
  }

  get purchaseItems(): FormArray {
    return this.purchaseForm.get('purchaseItems') as FormArray;
  }

  loadVendors(): void {
    this.purchaseService.getVendors().subscribe({
      next: (vendors) => {
        this.vendors = vendors;
        console.log(this.vendors)
      },
      error: (error) => {
        console.error('Error loading vendors:', error);
      }
    });
  }

  loadPurchaseData(purchaseId: number): void {
    this.purchaseService.getPurchaseById(purchaseId).subscribe({
      next: (purchase) => {
        this.originalPurchase = purchase;
        
        this.populateForm(purchase);
        // Load vendor items after form is populated
        if (purchase.vendorId) {
          this.loadVendorItemsForEdit(purchase.vendorId, purchase);
        }
      },
      error: (error) => {
        console.error('Error loading purchase data:', error);
        alert('Error loading purchase data. Please try again.');
      }
    });
  }

  
  populateForm(purchase: PurchaseMain): void {
    debugger;
   
 
    this.purchaseForm.patchValue({
      voucherDate: this.pipe.transform(purchase.voucherDate,'yyyy-MM-dd'),//? purchase.voucherDate.toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10),
      vendorId: Number(purchase.vendorId),
      paidAmount: purchase.paidAmount || 0,
      prvBalance: purchase.prvBalance || 0,
      currentAmount: purchase.currentAmount || 0,
      totalTpAmount: this.totalTpAmount || 0,
      branchId: purchase.branchId || 1,
      userId: purchase.userId || 1,
      purchaseItems: purchase.purchaseSubs
    });

    console.log(this.purchaseForm)
  }

  loadVendorItemsForEdit(vendorId: number, purchase: PurchaseMainCreate): void {
    this.purchaseService.getVendorItems(vendorId).subscribe({
      next: (items) => {
        this.vendorItems = items;
        this.selectedVendorItems = [...items];
        console.log(this.selectedVendorItems)
        this.populateItemsGridForEdit(purchase);
      },
      error: (error) => {
        console.error('Error loading vendor items:', error);
      }
    });
  }

  populateItemsGridForEdit(purchase: PurchaseMainCreate): void {
    this.purchaseItems.clear();
    
    this.selectedVendorItems.forEach(item => {
      // Find if this item exists in the purchase
      const existingItem = purchase.purchaseSubs?.find(sub => sub.itemId === item.itemId);
      
      const itemGroup = this.fb.group({
        itemId: [item.itemId],
        itemName: [item.name],
        productCode: [item.productCode],
        lastPurchaseRate: [item.tpRate],
        currentStock: [item.costPercent],
        qty: [existingItem?.qty || 0],
        rate: [existingItem?.rate || item.costRate],
        lineAmount: [existingItem?.lineAmount || 0],
        tpTotal: [0] 
      });

      // Calculate line amount when qty or rate changes
      itemGroup.get('qty')?.valueChanges.subscribe(() => this.calculateLineAmount(itemGroup));
      itemGroup.get('rate')?.valueChanges.subscribe(() => this.calculateLineAmount(itemGroup));

      this.purchaseItems.push(itemGroup);
    });

    this.calculateTotalAmount();
  }




  onVendorChange(vendorId: number): void {
    if (vendorId) {
      this.isLoading=true
      this.purchaseService.getVendorItems(vendorId).subscribe({
        next: (items) => {
          this.vendorItems = items;
          this.selectedVendorItems = [...items];
          this.populateItemsGrid();
          this.isLoading=false
        },
        error: (error) => {
          console.error('Error loading vendor items:', error);
        }
      });
    } else {
      this.vendorItems = [];
      this.selectedVendorItems = [];
      this.purchaseItems.clear();
    }
  }

  populateItemsGrid(): void {
    this.purchaseItems.clear();
    this.selectedVendorItems.forEach(item => {
      const itemGroup = this.fb.group({
        itemId: [item.itemId],
        itemName: [item.name],
        productCode: [item.productCode],
        lastPurchaseRate: [item.tpRate],
        currentStock: [item.costPercent],
        qty: [0],
        rate: [item.costRate],
        lineAmount: [0],
        tpTotal: [0] 
      });

      // Calculate line amount when qty or rate changes
      itemGroup.get('qty')?.valueChanges.subscribe(() => this.calculateLineAmount(itemGroup));
      itemGroup.get('rate')?.valueChanges.subscribe(() => this.calculateLineAmount(itemGroup));
      itemGroup.get('lastPurchaseRate')?.valueChanges.subscribe(() => this.calculateLineAmount(itemGroup));

      this.purchaseItems.push(itemGroup);
    });
  }
tpTotal=0;
calculateLineAmount(itemGroup: FormGroup): void {
  const qty = itemGroup.get('qty')?.value || 0;
  const lastPurchaseRate = itemGroup.get('lastPurchaseRate')?.value || 0;
  const rate = itemGroup.get('rate')?.value || 0;

  const tpTotal = qty * lastPurchaseRate;
  const lineAmount = qty * rate;

  itemGroup.patchValue(
    {
      lineAmount: parseFloat(lineAmount.toFixed(2)),
      tpTotal: parseFloat(tpTotal.toFixed(2))
    },
    { emitEvent: false }
  );

  this.calculateTotalAmount();
}
totalTpAmount=0;
calculateTotalAmount(): void {
  // debugger
  let totalAmount = 0;
  this.totalTpAmount = 0;

  this.purchaseItems.controls.forEach(control => {
    const qty = control.get('qty')?.value || 0;
    const lineAmount = control.get('lineAmount')?.value || 0;
    const tpTotal = control.get('tpTotal')?.value || 0;

    if (qty > 0) {
      totalAmount += lineAmount;
      this.totalTpAmount += tpTotal;  // <-- add this line
    }
  });

  this.purchaseForm.patchValue({
    currentAmount: parseFloat(totalAmount.toFixed(2)),
    totalTpAmount: parseFloat(this.totalTpAmount.toFixed(2))  // <-- set TP grand total
  });
}
  
  // calculateTotalAmount(): void {
  //   const totalAmount = this.purchaseItems.controls.reduce((total, control) => {
  //     const lineAmount = control.get('lineAmount')?.value || 0;
  //     const qty = control.get('qty')?.value || 0;
  //     // Only include items that have quantity > 0
  //     return qty > 0 ? total + lineAmount : total;
  //   }, 0);

  //   this.purchaseForm.patchValue({
  //     currentAmount: parseFloat(totalAmount.toFixed(2))
  //   });
  // }

  // Get count of items with quantity > 0
  getSelectedItemsCount(): number {
    return this.purchaseItems.controls.filter(control => 
      (control.get('qty')?.value || 0) > 0
    ).length;
  }

  // Check if at least one item has quantity > 0
  hasItemsWithQuantity(): boolean {
    return this.getSelectedItemsCount() > 0;
  }

  // onSubmit(): void {
  //   debugger
  //   try
  //   {    if (this.purchaseForm.valid && this.hasItemsWithQuantity() && this.purchaseId) {
  //     this.isSubmitting = true;

  //     const formValue = this.purchaseForm.value;

  //     console.log(this.purchaseForm.value)
  //     const purchaseData: any = {
  //       id: this.purchaseId,
  //       voucherDate: formValue.voucherDate,
  //       vendorId: formValue.vendorId,
  //       paidAmount: formValue.paidAmount,
  //       prvBalance: formValue.prvBalance,
  //       currentAmount: formValue.currentAmount,
  //       branchId: formValue.branchId,
  //       userId: formValue.userId,
  //       purchaseSubs: formValue.purchaseItems
  //         .filter((item: any) => item.qty > 0) // Only include items with quantity > 0
  //         .map((item: any) => ({
  //           itemId: item.itemId,
  //           qty: item.qty,
  //           rate: item.rate,
  //           lineAmount: item.lineAmount,
  //           branchId: formValue.branchId
  //         }))
  //     };

  //     this.purchaseService.updatePurchase(this.purchaseId, purchaseData).subscribe({
  //       next: (response) => {
  //         alert('Purchase updated successfully!');
  //         this.isSubmitting = false;
  //         this.router.navigate(['/purchases']); // Navigate back to purchases list
  //       },
  //       error: (error) => {
  //         console.error('Error updating purchase:', error);
  //         alert('Error updating purchase. Please try again.');
  //         this.isSubmitting = false;
  //       }
  //     });
  //   } else {
  //     this.markFormGroupTouched(this.purchaseForm);
  //     if (!this.hasItemsWithQuantity()) {
  //       alert('Please add quantity for at least one item to proceed with the purchase.');
  //     }
  //   }
  // }
  // catch(err){
  //   console.error(err)
  // }
  // }
onSubmit(): void {
  debugger;

  try {

    console.log("Form valid:", this.purchaseForm.valid);
    console.log("Has items:", this.hasItemsWithQuantity());
    console.log("Purchase ID:", this.purchaseId);

    if (!this.purchaseForm.valid) {
      console.warn("Form is invalid.");
      this.markFormGroupTouched(this.purchaseForm);
      return;
    }

    if (!this.hasItemsWithQuantity()) {
      alert("Please add quantity for at least one item.");
      return;
    }
    if(this.isEdit){
    if (!this.purchaseId) {
      console.warn("Purchase ID missing!");
      return;
    }
  }

    this.isSubmitting = true;

    const formValue = this.purchaseForm.value;

    const purchaseData = {
      id: this.isEdit?this.purchaseId : 0,
      voucherDate: formValue.voucherDate,
      vendorId: formValue.vendorId,
      paidAmount: formValue.paidAmount,
      prvBalance: formValue.prvBalance,
      currentAmount: formValue.currentAmount,
      branchId: formValue.branchId,
      userId: formValue.userId,
      purchaseSubs: formValue.purchaseItems
        .filter((item: any) => item.qty > 0)
        .map((item: any) => ({
          itemId: item.itemId,
          qty: item.qty,
          rate: item.rate,
          lineAmount: item.lineAmount,
          branchId: formValue.branchId
        }))
    };


if(this.isEdit){
    this.purchaseService.updatePurchase(Number(this.purchaseId), purchaseData).subscribe({
      next: () => {
        this.toastService.success("Purchase updated successfully!");
        this.isSubmitting = false;
        this.navigateToIndexPage()
      },
      error: (error) => {
        console.error("Error updating purchase:", error);
        this.toastService.error("Error updating purchase");
        this.isSubmitting = false;
      }
    });
  }else{

    this.purchaseService.createPurchase(purchaseData).subscribe({
      next: ()=>{
        this.toastService.success("Purchase generated successfully");
        this.isSubmitting=false;
       this.navigateToIndexPage()
      },
      error:(error)=>{
        console.error("error saving purcahse: ", error);
        this.toastService.error("Error generating purchase");
        this.isSubmitting=false;
      }
    })
  }


  } catch (err) {
    console.error("Submit crashed:", err);
  }
}

navigateToIndexPage(){
  this.router.navigate(["/purchases"]);
}
  resetForm(): void {
    if (this.originalPurchase) {
      this.populateForm(this.originalPurchase);
      if (this.originalPurchase.vendorId) {
        this.loadVendorItemsForEdit(this.originalPurchase.vendorId, this.originalPurchase);
      }
    } else {
      this.purchaseForm.reset({
        voucherDate: new Date().toISOString().substring(0, 10),
        paidAmount: 0,
        prvBalance: 0,
        currentAmount: 0,
        branchId: 1,
        userId: 1
      });
      this.purchaseItems.clear();
      this.vendorItems = [];
      this.selectedVendorItems = [];
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    debugger
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched(arrayControl);
          } else {
            arrayControl.markAsTouched();
          }
        });
      } else {
        control?.markAsTouched();
      }
    });
  }

  // Add back button functionality
  onBack(): void {
    this.router.navigate(['/purchases']);
  }

//   focusNextQty(index: number): void {
//   const inputs = this.qtyInputs.toArray();

//   const next = inputs[index + 1];
//   if (next) {
//     next.nativeElement.focus();
//     return;
//   }

//   inputs[index].nativeElement.blur();
// }

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
}