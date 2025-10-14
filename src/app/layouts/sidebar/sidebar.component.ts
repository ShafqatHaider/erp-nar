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
    { name: 'Accounts', icon: '🛒', route: '/accounts' },
    { name: 'Products', icon: '📦', route: '/codes/items' }, // Add this
    { name: 'Categories', icon: '🏷️', route: '/codes/categories' },
    { name: 'Sales', icon: '💰', route: '/sales' },
    { name: 'Purchases', icon: '📈', route: '/purchases' },
    { name: 'H.R', icon: '📈', route: '/hr' },
    { name: 'Payroll', icon: '📈', route: '/hr/payroll' },
    // { name: 'Reports', icon: '📈', route: '/reports' },
    
  ];

  onToggle() {
    this.toggle.emit();
  }
}