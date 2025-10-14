import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '../../Core/Services/account.service';
import { AccountCategoriesDto, CreateAccountCentral } from '../../Core/models/account.model';


@Component({
  selector: 'app-account-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account-form.component.html'
})
export class AccountFormComponent implements OnInit {
  private accountService = inject(AccountService);
  private fb = inject(FormBuilder);
  public router = inject(Router);
  public route = inject(ActivatedRoute);
  accountForm: FormGroup;
  categories: AccountCategoriesDto[] = [];
  isEdit = false;
  accountId: number | null = null;
  isLoading = false;
  isSubmitting = false;
  isCategoriesLoading = false;
  

  accountTypes = [
    { value: 'Customer', label: 'Customer', description: 'Customers who purchase from your business' },
    { value: 'SalesMan', label: 'Sales Man', description: 'Sales representatives and agents' },
    { value: 'Vendor', label: 'Vendor/Brand', description: 'Suppliers and product vendors' },
    { value: 'Employee', label: 'Employee', description: 'Company employees and staff' },
    { value: 'Expense', label: 'Expense', description: 'Expense accounts for costs and overheads' }
  ];

  balanceTypes = [
    { value: 1, label: 'Debit', description: 'Normal balance is debit (Assets, Expenses)' },
    { value: 2, label: 'Credit', description: 'Normal balance is credit (Liabilities, Income, Equity)' }
  ];

  constructor() {
    this.accountForm = this.fb.group({
      cateAccId: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      openingBalance: [0, [Validators.required, Validators.min(0)]],
      balanceType: [1, Validators.required],
      accountType: ['', Validators.required],
      isActive: [1]
    });
  }

  ngOnInit() {
    this.loadCategories();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.accountId = +params['id'];
        this.loadAccount(this.accountId);
      }
    });
  }

  loadCategories() {
    this.isCategoriesLoading = true;
    this.accountService.getAccountCategories().subscribe({
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

  loadAccount(accId: number) {
    this.isLoading = true;
    this.accountService.getAccountById(accId).subscribe({
      next: (account) => {
        this.accountForm.patchValue({
          cateAccId: account.cateAccId,
          title: account.title,
          openingBalance: account.openingBalance,
          balanceType: account.balanceType,
          accountType: account.accountType,
          isActive: account.isActive
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading account:', error);
        this.isLoading = false;
        alert('Error loading account details');
      }
    });
  }

  onSubmit() {
    if (this.accountForm.valid) {
      this.isSubmitting = true;
      const formData: CreateAccountCentral = this.accountForm.value;

      const operation = this.isEdit 
        ? this.accountService.updateAccount(this.accountId!, formData)
        : this.accountService.createAccount(formData);

      operation.subscribe({
        next: (account) => {
          this.router.navigate(['/accounts']);
        },
        error: (error) => {
          console.error('Error saving account:', error);
          alert('Error saving account. Please try again.');
          this.isSubmitting = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.accountForm.controls).forEach(key => {
      this.accountForm.get(key)?.markAsTouched();
    });
  }

  getAccountTypeDescription(type: string): string {
    return this.accountTypes.find(t => t.value === type)?.description || '';
  }

  getBalanceTypeDescription(type: number): string {
    return this.balanceTypes.find(t => t.value === type)?.description || '';
  }
}