import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-form-header',
  standalone: true,
  imports: [],
  templateUrl: './form-header.component.html',
  styleUrl: './form-header.component.scss'
})
export class FormHeaderComponent {
  @Input() title: string = '';
  
  @Output() back = new EventEmitter<void>();


  
}
