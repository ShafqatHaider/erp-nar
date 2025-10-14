import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
  name: string;
  icon: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  @Input() isOpen = true;
  @Output() toggle = new EventEmitter<void>();

  menuItems: MenuItem[] = [
    { name: 'Dashboard', icon: '📊', route: '/dashboard' },
    { name: 'POS', icon: '🛒', route: '/pos' },
    { name: 'Products', icon: '📦', route: '/products' },
    { name: 'Sales', icon: '💰', route: '/sales' },
    { name: 'Customers', icon: '👥', route: '/customers' },
    { name: 'Inventory', icon: '📋', route: '/inventory', badge: 12 },
    { name: 'Reports', icon: '📈', route: '/reports' },
    { name: 'Users', icon: '👤', route: '/users' },
    { name: 'Settings', icon: '⚙️', route: '/settings' }
  ];

  onToggle() {
    this.toggle.emit();
  }
}