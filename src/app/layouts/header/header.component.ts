import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../Core/models/auth.model';
import { AuthService } from '../../Core/Services/auth.service';
// import { AuthService, User } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  @Input() user: User| null = null;
  @Output() sidebarToggle = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  @Input() pageTitle: string = '';

    private authService = inject(AuthService);
  private router = inject(Router);

  isDropdownOpen = false;
  isNotificationsOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.isNotificationsOpen = false;
  }

  toggleNotifications() {
    this.isNotificationsOpen = !this.isNotificationsOpen;
    this.isDropdownOpen = false;
  }

  onUserManagement() {
    this.router.navigate(['/users']);
    this.isDropdownOpen = false;
  }

  onProfile() {
    this.router.navigate(['/profile']);
    this.isDropdownOpen = false;
  }

  onLogout() {
    debugger
    this.logout.emit();
    this.isDropdownOpen = false;
  }

  onSidebarToggle() {
    this.sidebarToggle.emit();
  }
}