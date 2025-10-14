
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { StatsCardsComponent } from '../stats-cards/stats-cards.component';
import { ChartsComponent } from '../charts/charts.component';
import { RecentActivityComponent } from '../recent-activity/recent-activity.component';
import { AuthService } from '../../Core/Services/auth.service';
import { User } from '../../Core/models/auth.model';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    StatsCardsComponent,
    ChartsComponent,
    RecentActivityComponent
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
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

  private checkScreenSize() {
    if (window.innerWidth < 768) {
      this.isSidebarOpen = false;
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}