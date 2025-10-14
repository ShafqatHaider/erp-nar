// components/dashboard/charts/charts.component.ts
import { Component, Input, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './charts.component.html'
})
export class ChartsComponent implements AfterViewInit {
  @Input() type: 'sales' | 'revenue' = 'sales';

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    this.renderChart();
  }

  private renderChart() {
    // In a real app, you would use a charting library like Chart.js, ng2-charts, etc.
    // This is a simplified SVG-based chart for demonstration
    const canvas = this.elementRef.nativeElement.querySelector('.chart-canvas');
    if (canvas) {
      canvas.innerHTML = this.generateChartSVG();
    }
  }

  private generateChartSVG(): string {
    const points = this.type === 'sales' 
      ? [30, 45, 35, 55, 40, 65, 50, 75, 60, 80, 70, 85]
      : [20, 35, 25, 45, 30, 55, 40, 65, 50, 70, 60, 75];

    const maxValue = Math.max(...points);
    const normalizedPoints = points.map(p => (p / maxValue) * 100);
    
    let path = `M 0 ${100 - normalizedPoints[0]}`;
    normalizedPoints.forEach((point, index) => {
      if (index > 0) {
        path += ` L ${(index / (points.length - 1)) * 100} ${100 - point}`;
      }
    });

    return `
      <svg viewBox="0 0 100 100" class="w-full h-48">
        <path d="${path}" fill="none" stroke="currentColor" 
              stroke-width="2" class="text-blue-500" stroke-linecap="round"/>
        ${normalizedPoints.map((point, index) => `
          <circle cx="${(index / (points.length - 1)) * 100}" 
                  cy="${100 - point}" r="2" fill="currentColor" class="text-blue-600"/>
        `).join('')}
      </svg>
    `;
  }
}