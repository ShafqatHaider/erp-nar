
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../../Core/Services/account.service';
import { AccountCentral, AccountStats } from '../../Core/models/account.model';


@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './account-list.component.html'
})
export class AccountListComponent implements OnInit {
  private accountService = inject(AccountService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  accounts: AccountCentral[] = [];
  filteredAccounts: AccountCentral[] = [];
  stats: AccountStats | null = null;
  isLoading = true;
  isStatsLoading = false;
  searchForm: FormGroup;

  accountTypes = [
    { value: 'Customer', label: 'Customers', icon: '👥', color: 'blue' },
    { value: 'SalesMan', label: 'Sales Men', icon: '👨‍💼', color: 'green' },
    { value: 'Vendor', label: 'Vendors', icon: '🏢', color: 'purple' },
    { value: 'Employee', label: 'Employees', icon: '👨‍💻', color: 'orange' },
    { value: 'Expense', label: 'Expenses', icon: '💰', color: 'red' }
  ];

  constructor() {
    this.searchForm = this.fb.group({
      search: [''],
      accountType: ['']
    });
  }

  ngOnInit() {
    this.loadAccounts();
    this.loadStats();
    
    this.searchForm.valueChanges.subscribe(value => {
      this.filterAccounts(value);
    });
  }

  loadAccounts() {
    this.isLoading = true;
    this.accountService.getAllAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.filteredAccounts = accounts;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
        this.isLoading = false;
      }
    });
  }

  loadStats() {
    this.isStatsLoading = true;
    this.accountService.getAccountStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.isStatsLoading = false;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.isStatsLoading = false;
      }
    });
  }

  filterAccounts(filters: any) {
    let filtered = this.accounts;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(account => 
        account.title.toLowerCase().includes(searchLower) ||
        account.accountType.toLowerCase().includes(searchLower) ||
        account.accountCategory?.cateAccName.toLowerCase().includes(searchLower)
      );
    }

    if (filters.accountType) {
      filtered = filtered.filter(account => account.accountType === filters.accountType);
    }

    this.filteredAccounts = filtered;
  }

  deleteAccount(accId: number) {
    if (confirm('Are you sure you want to delete this account?')) {
      this.accountService.deleteAccount(accId).subscribe({
        next: () => {
          this.accounts = this.accounts.filter(a => a.accId !== accId);
          this.filteredAccounts = this.filteredAccounts.filter(a => a.accId !== accId);
          this.loadStats(); // Refresh stats
        },
        error: (error) => {
          console.error('Error deleting account:', error);
          alert('Error deleting account');
        }
      });
    }
  }

  getAccountTypeBadgeColor(type: string): string {
    const typeConfig = this.accountTypes.find(t => t.value === type);
    const color = typeConfig?.color || 'gray';
    return `bg-${color}-100 text-${color}-800`;
  }

  getAccountTypeIcon(type: string): string {
    return this.accountTypes.find(t => t.value === type)?.icon || '📄';
  }

  getBalanceTypeText(balanceType: number): string {
    return balanceType === 1 ? 'Debit' : 'Credit';
  }

  getAccountTypeCount(type: string): number {
    return this.stats?.accountsByType.find(t => t.type === type)?.count || 0;
  }

  getAccountTypeStats(type: string) {
    return this.stats?.accountsByType.find(t => t.type === type);
  }


  createAccount(){
    this.router.navigate(['/accounts/create']);
  }

  onEdit(e:any){
    this.router.navigate(['/accounts', e.accId, 'edit']);
  }
  viewLedger(e:any){
    this.router.navigate(['/accounts', e.accId, 'ledger']);
  }
}