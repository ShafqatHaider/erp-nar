import { Routes } from '@angular/router';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { AccountListComponent } from './components/account-list/account-list.component';
import { AccountFormComponent } from './components/account-form/account-form.component';
import { LoginComponent } from './Auth/login/login.component';
import { GuestGuard } from './Core/guards/guest.guard';
import { AuthGuard } from './Core/guards/auth.guard';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { ItemFormComponent } from './components/item-form/item-form.component';
import { HrListComponent } from './components/hr-list/hr-list.component';
import { PayrollListComponent } from './components/payroll-list/payroll-list.component';

import { PurchaseListComponent } from './components/purchase-list/purchase-list.component';
import { PurchaseComponent } from './purchase_Components/purchase/purchase.component';
import { SaleListComponent } from './sales/sale-list/sale-list.component';
import { SaleFormComponent } from './sales/sale-form/sale-form.component';

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent, 
    canActivate: [GuestGuard] 
  },
  // { 
  //   path: 'register', 
  //   component: RegisterComponent, 
  //   canActivate: [GuestGuard] 
  // },
  {
    path: '',
    canActivate: [AuthGuard], 
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'accounts', component: AccountListComponent },
      { path: 'accounts/create', component: AccountFormComponent },
      { path: 'accounts/:id/edit', component: AccountFormComponent },
      // { path: 'accounts/:id/ledger', component: AccountLedgerComponent },
  { path: 'codes/categories', component: CategoryListComponent },
  { path: 'codes/categories/create', component: CategoryFormComponent },
  { path: 'codes/categories/:id/edit', component: CategoryFormComponent },
  { path: 'codes/items', component: ItemListComponent },
  { path: 'codes/items/create', component: ItemFormComponent },
  { path: 'codes/items/:id/edit', component: ItemFormComponent },
  { path: 'hr', component: HrListComponent },
  { path: 'hr/payroll', component: PayrollListComponent },
  { path: 'sales', component: SaleListComponent },
  { path: 'sales/create', component: SaleFormComponent },
  { path: 'sales/:id/edit', component: SaleFormComponent },
  { path: 'purchases', component: PurchaseListComponent },
  { path: 'purchases/create', component: PurchaseComponent },
  { path: 'purchases/:id/edit', component: PurchaseComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, 
    ]
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
];