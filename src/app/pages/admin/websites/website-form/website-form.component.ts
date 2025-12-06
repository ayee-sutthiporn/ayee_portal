import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { WebsiteService } from '../../../../services/website.service';
import { CategoryService } from '../../../../services/category.service';
import { Website } from '../../../../models/models';

@Component({
  selector: 'app-website-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ isEditMode ? 'Edit Website' : 'Add Website' }}</h2>
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

          <!-- URL -->
          <div>
            <label for="url" class="block text-sm font-medium text-gray-700 dark:text-gray-300">URL</label>
            <input type="url" id="url" formControlName="url" 
                   class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm p-2 border">
            <div *ngIf="form.get('url')?.touched && form.get('url')?.invalid" class="text-red-500 text-xs mt-1">Valid URL is required</div>
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea id="description" formControlName="description" rows="3"
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm p-2 border"></textarea>
          </div>

          <!-- Category -->
          <div>
            <label for="categoryId" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <select id="categoryId" formControlName="categoryId" 
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm p-2 border">
              <option value="" disabled>Select a category</option>
              <option *ngFor="let category of categoryService.categories()" [value]="category.id">{{ category.name }}</option>
            </select>
            <div *ngIf="form.get('categoryId')?.touched && form.get('categoryId')?.invalid" class="text-red-500 text-xs mt-1">Category is required</div>
          </div>

          <!-- Image Upload -->
          <div>
            <label for="websiteImage" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Website Image</label>
            <div class="mt-1 flex items-center space-x-4">
              <div *ngIf="imagePreview" class="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                <img [src]="imagePreview" alt="Preview" class="w-full h-full object-cover">
                <button type="button" (click)="removeImage('imageUrl')" class="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-lg hover:bg-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
              <input type="file" id="websiteImage" (change)="onFileSelected($event, 'imageUrl')" accept="image/*"
                     class="block w-full text-sm text-gray-500 dark:text-gray-400
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-primary/10 file:text-primary
                            hover:file:bg-primary/20">
            </div>
          </div>

          <!-- Icon Upload -->
          <div>
            <label for="websiteIcon" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Website Icon</label>
            <div class="mt-1 flex items-center space-x-4">
              <div *ngIf="iconPreview" class="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                <img [src]="iconPreview" alt="Icon Preview" class="w-full h-full object-cover">
                <button type="button" (click)="removeImage('icon')" class="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-lg hover:bg-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
              <input type="file" id="websiteIcon" (change)="onFileSelected($event, 'icon')" accept="image/*"
                     class="block w-full text-sm text-gray-500 dark:text-gray-400
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-primary/10 file:text-primary
                            hover:file:bg-primary/20">
            </div>
          </div>

          <!-- Visibility -->
          <div class="flex items-center">
            <input type="checkbox" id="isVisible" formControlName="isVisible" 
                   class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded">
            <label for="isVisible" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">Visible on site</label>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <a routerLink="/admin/websites" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
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
export class WebsiteFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private websiteService = inject(WebsiteService);
  categoryService = inject(CategoryService);

  form: FormGroup;
  isEditMode = false;
  websiteId: string | null = null;
  imagePreview: string | null = null;
  iconPreview: string | null = null;

  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      url: ['', [Validators.required, Validators.pattern('https?://.+')]],
      description: [''],
      categoryId: ['', Validators.required],
      imageUrl: [''],
      icon: [''],
      isVisible: [true]
    });
  }

  ngOnInit() {
    this.websiteId = this.route.snapshot.paramMap.get('id');
    if (this.websiteId) {
      this.isEditMode = true;
      const website = this.websiteService.getWebsiteById(this.websiteId);
      if (website) {
        this.form.patchValue(website);
        this.imagePreview = website.imageUrl || null;
        this.iconPreview = website.icon || null;
      } else {
        this.router.navigate(['/admin/websites']);
      }
    }
  }

  onFileSelected(event: Event, field: 'imageUrl' | 'icon') {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.form.patchValue({ [field]: base64String });
        if (field === 'imageUrl') {
          this.imagePreview = base64String;
        } else {
          this.iconPreview = base64String;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(field: 'imageUrl' | 'icon') {
    this.form.patchValue({ [field]: '' });
    if (field === 'imageUrl') {
      this.imagePreview = null;
    } else {
      this.iconPreview = null;
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      if (this.isEditMode && this.websiteId) {
        const updatedWebsite: Website = {
          ...this.websiteService.getWebsiteById(this.websiteId)!,
          ...formValue
        };
        this.websiteService.updateWebsite(updatedWebsite);
      } else {
        this.websiteService.createWebsite(formValue);
      }
      this.router.navigate(['/admin/websites']);
    }
  }
}
