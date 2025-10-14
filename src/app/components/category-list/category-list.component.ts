import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CodeService } from '../../Core/Services/code.service';
import { CodeCategory } from '../../Core/models/code.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './category-list.component.html'
})
export class CategoryListComponent implements OnInit {
  private codeService = inject(CodeService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  categories: CodeCategory[] = [];
  filteredCategories: CodeCategory[] = [];
  isLoading = true;
  searchForm: FormGroup;

  constructor() {
    this.searchForm = this.fb.group({
      search: ['']
    });
  }

  ngOnInit() {
    this.loadCategories();
    
    this.searchForm.valueChanges.subscribe(value => {
      this.filterCategories(value);
    });
  }

  loadCategories() {
    this.isLoading = true;
    this.codeService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.filteredCategories = categories;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.isLoading = false;
      }
    });
  }

  filterCategories(filters: any) {
    let filtered = this.categories;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(category => 
        category.cateName.toLowerCase().includes(searchLower)
      );
    }

    this.filteredCategories = filtered;
  }

  deleteCategory(id: number) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.codeService.deleteCategory(id).subscribe({
        next: () => {
          this.categories = this.categories.filter(c => c.id !== id);
          this.filteredCategories = this.filteredCategories.filter(c => c.id !== id);
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          alert('Error deleting category. Make sure no items are associated with it.');
        }
      });
    }
  }

  viewCategoryItems(categoryId: number) {
    this.router.navigate(['/codes/items'], { queryParams: { category: categoryId } });
  }
}