// import { Component, OnInit } from '@angular/core';
// import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Vendor, VendorItem } from '../../Core/models/purchase.model';
// import { PurchaseService } from '../../Core/Services/purchase.service';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-purchase',
//   standalone: true,
//   imports: [FormsModule, ReactiveFormsModule, CommonModule],
//   templateUrl: './purchase.component.html',
//   styleUrl: './purchase.component.scss'
// })
// export class PurchaseComponent implements OnInit {
//   isEdit: boolean = false;
//   purchaseForm: FormGroup;
//   vendors: Vendor[] = [];
//   vendorItems: VendorItem[] = [];
//   selectedVendorItems: VendorItem[] = [];
//   isSubmitting = false;

//   constructor(
//     private fb: FormBuilder,
//     private purchaseService: PurchaseService
//   ) {
//     this.purchaseForm = this.createForm();
//   }

//   ngOnInit(): void {
//     this.loadVendors();
//   }

//   createForm(): FormGroup {
//     return this.fb.group({
//       voucherDate: [new Date().toISOString().substring(0, 10), Validators.required],
//       vendorId: [null, Validators.required],
//       paidAmount: [0, [Validators.required, Validators.min(0)]],
//       prvBalance: [0, [Validators.required, Validators.min(0)]],
//       currentAmount: [0, [Validators.required, Validators.min(0)]],
//       branchId: [1, Validators.required],
//       userId: [1, Validators.required],
//       purchaseItems: this.fb.array([])
//     });
//   }

//   get purchaseItems(): FormArray {
//     return this.purchaseForm.get('purchaseItems') as FormArray;
//   }

//   loadVendors(): void {
//     this.purchaseService.getVendors().subscribe({
//       next: (vendors) => {
//         this.vendors = vendors;
//       },
//       error: (error) => {
//         console.error('Error loading vendors:', error);
//       }
//     });
//   }

//   onVendorChange(vendorId: number): void {
//     if (vendorId) {
//       this.purchaseService.getVendorItems(vendorId).subscribe({
//         next: (items) => {
//           this.vendorItems = items;
//           this.selectedVendorItems = [...items];
//           this.populateItemsGrid();
//         },
//         error: (error) => {
//           console.error('Error loading vendor items:', error);
//         }
//       });
//     } else {
//       this.vendorItems = [];
//       this.selectedVendorItems = [];
//       this.purchaseItems.clear();
//     }
//   }

//   populateItemsGrid(): void {
//     this.purchaseItems.clear();
//     this.selectedVendorItems.forEach(item => {
//       const itemGroup = this.fb.group({
//         itemId: [item.itemId],
//         itemName: [item.name],
//         productCode: [item.productCode],
//         lastPurchaseRate: [item.costRate],
//         currentStock: [item.stockQty],
//         qty: [0], // Remove required validator, make it optional
//         rate: [item.costRate],
//         lineAmount: [0]
//       });

//       // Calculate line amount when qty or rate changes
//       itemGroup.get('qty')?.valueChanges.subscribe(() => this.calculateLineAmount(itemGroup));
//       itemGroup.get('rate')?.valueChanges.subscribe(() => this.calculateLineAmount(itemGroup));

//       this.purchaseItems.push(itemGroup);
//     });
//   }

//   calculateLineAmount(itemGroup: FormGroup): void {
//     const qty = itemGroup.get('qty')?.value || 0;
//     const rate = itemGroup.get('rate')?.value || 0;
//     const lineAmount = qty * rate;
//     itemGroup.patchValue({ lineAmount: parseFloat(lineAmount.toFixed(2)) }, { emitEvent: false });
//     this.calculateTotalAmount();
//   }

//   calculateTotalAmount(): void {
//     const totalAmount = this.purchaseItems.controls.reduce((total, control) => {
//       const lineAmount = control.get('lineAmount')?.value || 0;
//       const qty = control.get('qty')?.value || 0;
//       // Only include items that have quantity > 0
//       return qty > 0 ? total + lineAmount : total;
//     }, 0);

//     this.purchaseForm.patchValue({
//       currentAmount: parseFloat(totalAmount.toFixed(2))
//     });
//   }

//   // Get count of items with quantity > 0
//   getSelectedItemsCount(): number {
//     return this.purchaseItems.controls.filter(control => 
//       (control.get('qty')?.value || 0) > 0
//     ).length;
//   }

//   // Check if at least one item has quantity > 0
//   hasItemsWithQuantity(): boolean {
//     return this.getSelectedItemsCount() > 0;
//   }

//   onSubmit(): void {
//     if (this.purchaseForm.valid && this.hasItemsWithQuantity()) {
//       this.isSubmitting = true;

//       const formValue = this.purchaseForm.value;
//       const purchaseData: any = {
//         voucherDate: formValue.voucherDate,
//         vendorId: formValue.vendorId,
//         paidAmount: formValue.paidAmount,
//         prvBalance: formValue.prvBalance,
//         currentAmount: formValue.currentAmount,
//         branchId: formValue.branchId,
//         userId: formValue.userId,
//         purchaseSubs: formValue.purchaseItems
//           .filter((item: any) => item.qty > 0) // Only include items with quantity > 0
//           .map((item: any) => ({
//             itemId: item.itemId,
//             qty: item.qty,
//             rate: item.rate,
//             lineAmount: item.lineAmount,
//             branchId: formValue.branchId
//           }))
//       };

//       this.purchaseService.createPurchase(purchaseData).subscribe({
//         next: (response) => {
//           alert('Purchase created successfully!');
//           this.resetForm();
//           this.isSubmitting = false;
//         },
//         error: (error) => {
//           console.error('Error creating purchase:', error);
//           alert('Error creating purchase. Please try again.');
//           this.isSubmitting = false;
//         }
//       });
//     } else {
//       this.markFormGroupTouched(this.purchaseForm);
//       if (!this.hasItemsWithQuantity()) {
//         alert('Please add quantity for at least one item to proceed with the purchase.');
//       }
//     }
//   }

//   resetForm(): void {
//     this.purchaseForm.reset({
//       voucherDate: new Date().toISOString().substring(0, 10),
//       paidAmount: 0,
//       prvBalance: 0,
//       currentAmount: 0,
//       branchId: 1,
//       userId: 1
//     });
//     this.purchaseItems.clear();
//     this.vendorItems = [];
//     this.selectedVendorItems = [];
//   }

//   markFormGroupTouched(formGroup: FormGroup): void {
//     Object.keys(formGroup.controls).forEach(key => {
//       const control = formGroup.get(key);
//       if (control instanceof FormGroup) {
//         this.markFormGroupTouched(control);
//       } else {
//         control?.markAsTouched();
//       }
//     });
//   }
// }


import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Vendor, VendorItem, Purchase, PurchaseMainCreate, PurchaseMain } from '../../Core/models/purchase.model';
import { PurchaseService } from '../../Core/Services/purchase.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-purchase',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.scss'
})
export class PurchaseComponent implements OnInit {
  isEdit: boolean = true;
  purchaseForm: FormGroup;
  vendors: Vendor[] = [];
  vendorItems: VendorItem[] = [];
  selectedVendorItems: VendorItem[] = [];
  isSubmitting = false;
  purchaseId: number | null = null;
  originalPurchase: PurchaseMain | null = null;
createPurchase:PurchaseMainCreate | null=null;
  constructor(
    private fb: FormBuilder,
    private purchaseService: PurchaseService,
    private route: ActivatedRoute,
    private router: Router,
    private pipe:DatePipe
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
        this.purchaseId = +id;
        this.loadPurchaseData(this.purchaseId);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      voucherDate: [new Date().toISOString().substring(0, 10), Validators.required],
      vendorId: [null, Validators.required],
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
      vendorId: purchase.vendorId,
      paidAmount: purchase.paidAmount || 0,
      prvBalance: purchase.prvBalance || 0,
      currentAmount: purchase.currentAmount || 0,
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
        lastPurchaseRate: [item.costRate],
        currentStock: [item.stockQty],
        qty: [existingItem?.qty || 0],
        rate: [existingItem?.rate || item.costRate],
        lineAmount: [existingItem?.lineAmount || 0]
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
      this.purchaseService.getVendorItems(vendorId).subscribe({
        next: (items) => {
          this.vendorItems = items;
          this.selectedVendorItems = [...items];
          this.populateItemsGrid();
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
        lastPurchaseRate: [item.costRate],
        currentStock: [item.stockQty],
        qty: [0],
        rate: [item.costRate],
        lineAmount: [0]
      });

      // Calculate line amount when qty or rate changes
      itemGroup.get('qty')?.valueChanges.subscribe(() => this.calculateLineAmount(itemGroup));
      itemGroup.get('rate')?.valueChanges.subscribe(() => this.calculateLineAmount(itemGroup));

      this.purchaseItems.push(itemGroup);
    });
  }

  calculateLineAmount(itemGroup: FormGroup): void {
    const qty = itemGroup.get('qty')?.value || 0;
    const rate = itemGroup.get('rate')?.value || 0;
    const lineAmount = qty * rate;
    itemGroup.patchValue({ lineAmount: parseFloat(lineAmount.toFixed(2)) }, { emitEvent: false });
    this.calculateTotalAmount();
  }

  calculateTotalAmount(): void {
    const totalAmount = this.purchaseItems.controls.reduce((total, control) => {
      const lineAmount = control.get('lineAmount')?.value || 0;
      const qty = control.get('qty')?.value || 0;
      // Only include items that have quantity > 0
      return qty > 0 ? total + lineAmount : total;
    }, 0);

    this.purchaseForm.patchValue({
      currentAmount: parseFloat(totalAmount.toFixed(2))
    });
  }

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

  onSubmit(): void {
    if (this.purchaseForm.valid && this.hasItemsWithQuantity() && this.purchaseId) {
      this.isSubmitting = true;

      const formValue = this.purchaseForm.value;
      const purchaseData: any = {
        id: this.purchaseId,
        voucherDate: formValue.voucherDate,
        vendorId: formValue.vendorId,
        paidAmount: formValue.paidAmount,
        prvBalance: formValue.prvBalance,
        currentAmount: formValue.currentAmount,
        branchId: formValue.branchId,
        userId: formValue.userId,
        purchaseSubs: formValue.purchaseItems
          .filter((item: any) => item.qty > 0) // Only include items with quantity > 0
          .map((item: any) => ({
            itemId: item.itemId,
            qty: item.qty,
            rate: item.rate,
            lineAmount: item.lineAmount,
            branchId: formValue.branchId
          }))
      };

      this.purchaseService.updatePurchase(this.purchaseId, purchaseData).subscribe({
        next: (response) => {
          alert('Purchase updated successfully!');
          this.isSubmitting = false;
          this.router.navigate(['/purchases']); // Navigate back to purchases list
        },
        error: (error) => {
          console.error('Error updating purchase:', error);
          alert('Error updating purchase. Please try again.');
          this.isSubmitting = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.purchaseForm);
      if (!this.hasItemsWithQuantity()) {
        alert('Please add quantity for at least one item to proceed with the purchase.');
      }
    }
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
}