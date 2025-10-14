
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
  }





  
}