
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
  color: string;
}

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-cards.component.html'
})
export class StatsCardsComponent {
  stats: StatCard[] = [
    {
      title: 'Total Sales',
      value: '$12,426',
      change: '+12.5%',
      trend: 'up',
      icon: '💰',
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Customers',
      value: '1,248',
      change: '+8.2%',
      trend: 'up',
      icon: '👥',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Orders',
      value: '324',
      change: '+5.7%',
      trend: 'up',
      icon: '📦',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      title: 'Revenue',
      value: '$8,245',
      change: '-2.4%',
      trend: 'down',
      icon: '📊',
      color: 'bg-orange-50 text-orange-600'
    }
  ];
}