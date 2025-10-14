// components/dashboard/recent-activity/recent-activity.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Activity {
  id: number;
  user: string;
  action: string;
  target: string;
  time: string;
  type: 'sale' | 'product' | 'user' | 'system';
}

@Component({
  selector: 'app-recent-activity',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-activity.component.html'
})
export class RecentActivityComponent {
  activities: Activity[] = [
    {
      id: 1,
      user: 'John Doe',
      action: 'made a sale',
      target: '#ORD-0012',
      time: '2 minutes ago',
      type: 'sale'
    },
    {
      id: 2,
      user: 'Sarah Wilson',
      action: 'added new product',
      target: 'iPhone 14 Pro',
      time: '15 minutes ago',
      type: 'product'
    },
    {
      id: 3,
      user: 'Mike Johnson',
      action: 'updated inventory for',
      target: 'Samsung Galaxy',
      time: '1 hour ago',
      type: 'product'
    },
    {
      id: 4,
      user: 'System',
      action: 'completed backup',
      target: 'Database',
      time: '2 hours ago',
      type: 'system'
    },
    {
      id: 5,
      user: 'Admin',
      action: 'created new user',
      target: 'Robert Brown',
      time: '3 hours ago',
      type: 'user'
    }
  ];

  getActivityIcon(type: string): string {
    const icons = {
      sale: '💰',
      product: '📦',
      user: '👤',
      system: '⚙️'
    };
    return icons[type as keyof typeof icons] || '📝';
  }

  getActivityColor(type: string): string {
    const colors = {
      sale: 'bg-green-100 text-green-800',
      product: 'bg-blue-100 text-blue-800',
      user: 'bg-purple-100 text-purple-800',
      system: 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  }
}