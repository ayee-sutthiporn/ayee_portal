import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Category } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'categories';

  categories = signal<Category[]>([]);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCategories();
    }
  }

  private loadCategories() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.categories.set(JSON.parse(stored));
    } else {
      // Default categories
      const defaults: Category[] = [
        { id: '1', name: 'Search Engines', order: 1, icon: 'search' },
        { id: '2', name: 'Social Media', order: 2, icon: 'users' },
        { id: '3', name: 'Development', order: 3, icon: 'code' },
        { id: '4', name: 'Entertainment', order: 4, icon: 'film' },
        { id: '5', name: 'AI Tools', order: 5, icon: 'cpu' },
        { id: '6', name: 'Design', order: 6, icon: 'palette' }
      ];
      this.categories.set(defaults);
      this.saveCategories();
    }
  }

  private saveCategories() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.categories()));
    }
  }

  getCategories() {
    return this.categories;
  }

  createCategory(category: Omit<Category, 'id'>) {
    const newCategory: Category = {
      ...category,
      id: crypto.randomUUID()
    };
    this.categories.update(cats => [...cats, newCategory]);
    this.saveCategories();
  }

  updateCategory(updatedCategory: Category) {
    this.categories.update(cats => cats.map(c => c.id === updatedCategory.id ? updatedCategory : c));
    this.saveCategories();
  }

  deleteCategory(id: string) {
    this.categories.update(cats => cats.filter(c => c.id !== id));
    this.saveCategories();
  }
}
