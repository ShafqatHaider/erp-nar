import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CodeService } from '../../Core/Services/code.service';
import { CreateCodeCategory } from '../../Core/models/code.model';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-form.component.html'
})
export class CategoryFormComponent implements OnInit {
  private codeService = inject(CodeService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  categoryForm: FormGroup;
  isEdit = false;
  categoryId: number | null = null;
  isLoading = false;
  isSubmitting = false;

  constructor() {
    this.categoryForm = this.fb.group({
      cateName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.categoryId = +params['id'];
        this.loadCategory(this.categoryId);
      }
    });
  }

  loadCategory(id: number) {
    this.isLoading = true;
    this.codeService.getCategoryById(id).subscribe({
      next: (category) => {
        this.categoryForm.patchValue({
          cateName: category.cateName
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading category:', error);
        this.isLoading = false;
        alert('Error loading category details');
      }
    });
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      this.isSubmitting = true;
      const formData: CreateCodeCategory = this.categoryForm.value;

      const operation = this.isEdit 
        ? this.codeService.updateCategory(this.categoryId!, formData)
        : this.codeService.createCategory(formData);

      operation.subscribe({
        next: (category) => {
          this.router.navigate(['/codes/categories']);
        },
        error: (error) => {
          console.error('Error saving category:', error);
          const errorMessage = error.error?.message || 'Error saving category';
          alert(errorMessage);
          this.isSubmitting = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.categoryForm.controls).forEach(key => {
      this.categoryForm.get(key)?.markAsTouched();
    });
  }


  goBack(){
    this.router.navigate(['/main/codes/categories'])
  }
}

