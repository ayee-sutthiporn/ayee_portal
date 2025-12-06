import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      
      <!-- Mobile Header -->
      <div class="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 z-20">
        <h1 class="text-lg font-bold text-primary dark:text-gold">Admin Panel</h1>
        <button (click)="toggleSidebar()" class="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <!-- Sidebar Overlay -->
      <div *ngIf="isSidebarOpen()" (click)="closeSidebar()" (keydown.enter)="closeSidebar()" (keydown.space)="closeSidebar()" tabindex="0" role="button" aria-label="Close sidebar"
           class="fixed inset-0 z-20 bg-black/50 md:hidden transition-opacity">
      </div>

      <!-- Sidebar -->
      <aside [class.translate-x-0]="isSidebarOpen()" [class.-translate-x-full]="!isSidebarOpen()"
             class="fixed md:relative z-30 w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0">
        <div class="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
          <h1 class="text-xl font-bold text-primary dark:text-gold">Admin Panel</h1>
        </div>
        
        <nav class="flex-1 overflow-y-auto py-4">
          <ul class="space-y-1 px-2">
            <li>
              <a routerLink="/admin/dashboard" routerLinkActive="bg-primary/10 text-primary dark:text-gold" (click)="closeSidebar()"
                 class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group transition-colors">
                <span class="font-medium">Dashboard</span>
              </a>
            </li>
            <li>
              <a routerLink="/admin/websites" routerLinkActive="bg-primary/10 text-primary dark:text-gold" (click)="closeSidebar()"
                 class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group transition-colors">
                <span class="font-medium">Websites</span>
              </a>
            </li>
            <li>
              <a routerLink="/admin/categories" routerLinkActive="bg-primary/10 text-primary dark:text-gold" (click)="closeSidebar()"
                 class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group transition-colors">
                <span class="font-medium">Categories</span>
              </a>
            </li>
            <li>
              <a routerLink="/admin/users" routerLinkActive="bg-primary/10 text-primary dark:text-gold" (click)="closeSidebar()"
                 class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group transition-colors">
                <span class="font-medium">Users</span>
              </a>
            </li>
            <li>
              <a routerLink="/admin/settings" routerLinkActive="bg-primary/10 text-primary dark:text-gold" (click)="closeSidebar()"
                 class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group transition-colors">
                <span class="font-medium">Settings</span>
              </a>
            </li>
            <li>
              <a routerLink="/admin/audit-logs" routerLinkActive="bg-primary/10 text-primary dark:text-gold" (click)="closeSidebar()"
                 class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group transition-colors">
                <span class="font-medium">Audit Logs</span>
              </a>
            </li>
          </ul>
        </nav>

        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
          <a routerLink="/" class="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            Back to Site
          </a>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 w-full">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AdminLayoutComponent {
  isSidebarOpen = signal(false);

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }

  closeSidebar() {
    this.isSidebarOpen.set(false);
  }
}
