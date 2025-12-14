import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Category } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private readonly ACTION_URL = `${environment.apiUrl}/categories`;

  categories = signal<Category[]>([]);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCategories();
    }
  }

  private loadCategories() {
    this.http.get<Category[]>(this.ACTION_URL).subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  getCategories() {
    // Refresh if empty? Or just return signal.
    if (this.categories().length === 0 && isPlatformBrowser(this.platformId)) {
      this.loadCategories();
    }
    return this.categories;
  }

  createCategory(category: Omit<Category, 'id'>) {
    this.http.post<Category>(this.ACTION_URL, category).subscribe({
      next: (newCategory) => {
        this.categories.update(cats => [...cats, newCategory]);
      },
      error: (err) => console.error('Failed to create category', err)
    });
  }

  updateCategory(updatedCategory: Category) {
    this.http.put<Category>(`${this.ACTION_URL}/${updatedCategory.id}`, updatedCategory).subscribe({
      next: (data) => {
        this.categories.update(cats => cats.map(c => c.id === data.id ? data : c));
      },
      error: (err) => console.error('Failed to update category', err)
    });
  }

  deleteCategory(id: string) {
    this.http.delete(`${this.ACTION_URL}/${id}`).subscribe({
      next: () => {
        this.categories.update(cats => cats.filter(c => c.id !== id));
      },
      error: (err) => console.error('Failed to delete category', err)
    });
  }
}
