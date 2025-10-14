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
    path: 'main',
    canActivate: [AuthGuard], // Protect the entire main section
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'accounts', component: AccountListComponent },
      { path: 'accounts/create', component: AccountFormComponent },
      { path: 'accounts/:id/edit', component: AccountFormComponent },
      // { path: 'accounts/:id/ledger', component: AccountLedgerComponent },
  { path: 'codes/categories', component: CategoryListComponent, canActivate: [AuthGuard] },
  { path: 'codes/categories/create', component: CategoryFormComponent, canActivate: [AuthGuard] },
  { path: 'codes/categories/:id/edit', component: CategoryFormComponent, canActivate: [AuthGuard] },
  { path: 'codes/items', component: ItemListComponent, canActivate: [AuthGuard] },
  { path: 'codes/items/create', component: ItemFormComponent, canActivate: [AuthGuard] },
  { path: 'codes/items/:id/edit', component: ItemFormComponent, canActivate: [AuthGuard] },
    ]
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];