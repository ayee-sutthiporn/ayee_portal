import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CategoryService } from '../../../../services/category.service';
import { Category } from '../../../../models/models';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ isEditMode ? 'Edit Category' : 'Add Category' }}</h2>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
          
          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input type="text" id="name" formControlName="name" 
                   class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm p-2 border">
            <div *ngIf="form.get('name')?.touched && form.get('name')?.invalid" class="text-red-500 text-xs mt-1">Name is required</div>
          </div>

          <!-- Order -->
          <div>
            <label for="order" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Order</label>
            <input type="number" id="order" formControlName="order" 
                   class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm p-2 border">
            <div *ngIf="form.get('order')?.touched && form.get('order')?.invalid" class="text-red-500 text-xs mt-1">Order is required</div>
          </div>

          <!-- Icon Upload -->
          <div>
            <label for="categoryIcon" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Category Icon</label>
            <div class="mt-1 flex items-center space-x-4">
              <div *ngIf="iconPreview" class="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                <img [src]="iconPreview" alt="Icon Preview" class="w-full h-full object-cover">
                <button type="button" (click)="removeIcon()" class="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-lg hover:bg-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
              <input type="file" id="categoryIcon" (change)="onFileSelected($event)" accept="image/*"
                     class="block w-full text-sm text-gray-500 dark:text-gray-400
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-primary/10 file:text-primary
                            hover:file:bg-primary/20">
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <a routerLink="/admin/categories" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              Cancel
            </a>
            <button type="submit" [disabled]="form.invalid" 
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isEditMode ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CategoryFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private categoryService = inject(CategoryService);

  form: FormGroup;
  isEditMode = false;
  categoryId: string | null = null;
  iconPreview: string | null = null;

  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      order: [0, Validators.required],
      icon: ['']
    });
  }

  ngOnInit() {
    this.categoryId = this.route.snapshot.paramMap.get('id');
    if (this.categoryId) {
      this.isEditMode = true;
      const category = this.categoryService.categories().find(c => c.id === this.categoryId);
      if (category) {
        this.form.patchValue(category);
        this.iconPreview = category.icon || null;
      } else {
        this.router.navigate(['/admin/categories']);
      }
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.form.patchValue({ icon: base64String });
        this.iconPreview = base64String;
      };
      reader.readAsDataURL(file);
    }
  }

  removeIcon() {
    this.form.patchValue({ icon: '' });
    this.iconPreview = null;
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      if (this.isEditMode && this.categoryId) {
        const updatedCategory: Category = {
          ...this.categoryService.categories().find(c => c.id === this.categoryId)!,
          ...formValue
        };
        this.categoryService.updateCategory(updatedCategory);
      } else {
        this.categoryService.createCategory(formValue);
      }
      this.router.navigate(['/admin/categories']);
    }
  }
}
