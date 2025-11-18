import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../../Core/Services/auth.service';
import { User } from '../../Core/models/auth.model';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterModule, SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit{
private authService = inject(AuthService);
  private router = inject(Router);
  
  currentUser: User | null = null;
  isSidebarOpen = true;

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Check screen size for responsive sidebar
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }
currentPageTitle ="";
getPageTitle(route: string): string {

  if (route.includes('/purchase/add'))  return 'Add Purchase';
  if (route.includes('/purchase/edit')) return 'Edit Purchase';
  if (route.includes('/purchases')) return 'Purchase List';

  if (route.includes('/sales/add')) return 'Add Sale';
  if (route.includes('/sales/edit')) return 'Edit Sale';
  if (route.includes('/sales')) return 'Sales List';

  if (route.includes('/products')) return 'Products';
  if (route.includes('/vendors')) return 'Vendors';
  if (route.includes('/customers')) return 'Customers';
  if (route.includes('/dashboard')) return 'Dashboard';

  return 'Application';
}
  detectRoutedComponent(){
     this.router.events.subscribe((event) => {
    if (event instanceof NavigationEnd) {
      
      const route = event.urlAfterRedirects;

      this.currentPageTitle = this.getPageTitle(route);
    }
  });
  }

  private checkScreenSize() {
    if (window.innerWidth < 768) {
      this.isSidebarOpen = false;
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onLogout() {
    debugger
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
