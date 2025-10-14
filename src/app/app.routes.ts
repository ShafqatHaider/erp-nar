import { Routes } from '@angular/router';
import { LoginComponent } from './Auth/login/login.component';

export const routes: Routes = [

    { path: 'login', component: LoginComponent },
//   { path: 'register', component: RegisterComponent },
//   { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
