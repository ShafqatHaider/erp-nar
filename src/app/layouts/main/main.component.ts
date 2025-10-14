import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from "@angular/router";
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
