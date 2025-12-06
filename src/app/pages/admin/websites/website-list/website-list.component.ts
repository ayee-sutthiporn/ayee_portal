import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WebsiteService } from '../../../../services/website.service';
import { CategoryService } from '../../../../services/category.service';

@Component({
  selector: 'app-website-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Websites</h2>
        <a routerLink="/admin/websites/new" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          Add Website
        </a>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">URL</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr *ngFor="let website of websiteService.websites()">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0">
                      <img [src]="website.imageUrl || 'assets/placeholder.png'" alt="" class="h-10 w-10 rounded-full object-cover bg-gray-100">
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ website.name }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{{ website.description }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {{ getCategoryName(website.categoryId) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <a [href]="website.url" target="_blank" class="hover:text-primary dark:hover:text-gold">{{ website.url }}</a>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="website.isVisible ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'" 
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ website.isVisible ? 'Visible' : 'Hidden' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a [routerLink]="['/admin/websites', website.id]" class="text-primary dark:text-gold hover:text-primary/80 mr-4">Edit</a>
                  <button (click)="deleteWebsite(website.id)" class="text-red-600 hover:text-red-900 dark:hover:text-red-400">Delete</button>
                </td>
              </tr>
              <tr *ngIf="websiteService.websites().length === 0">
                <td colspan="5" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No websites found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class WebsiteListComponent {
  websiteService = inject(WebsiteService);
  categoryService = inject(CategoryService);

  getCategoryName(categoryId: string): string {
    const category = this.categoryService.categories().find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  }

  deleteWebsite(id: string) {
    if (confirm('Are you sure you want to delete this website?')) {
      this.websiteService.deleteWebsite(id);
    }
  }
}
