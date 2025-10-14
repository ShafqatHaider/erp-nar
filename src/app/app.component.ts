import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainComponent } from './layouts/main/main.component';
import { AuthService } from './Core/Services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MainComponent,RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

    private authService = inject(AuthService);
  isLoggedIn = false;

  ngOnInit() {
    // Subscribe to authentication state changes
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user && this.authService.isAuthenticated();
    });

    // Initial check
    this.isLoggedIn = this.authService.isAuthenticated();
  }
  title = 'ERP';
}
