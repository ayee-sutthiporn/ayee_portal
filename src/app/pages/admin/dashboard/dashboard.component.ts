import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { WebsiteService } from '../../../services/website.service';
import { AuditService } from '../../../services/audit.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
      
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Total Users -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</h3>
          <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{{ userService.users().length }}</p>
        </div>

        <!-- Total Websites -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Websites</h3>
          <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{{ websiteService.websites().length }}</p>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Activities</h3>
          <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{{ auditService.logs().length }}</p>
        </div>
      </div>

      <!-- Recent Logs -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h3>
        </div>
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <div *ngFor="let log of auditService.logs().slice(0, 5)" class="px-6 py-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ log.username }} {{ log.action }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ log.details }}</p>
              </div>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ log.timestamp | date:'short' }}</span>
            </div>
          </div>
          <div *ngIf="auditService.logs().length === 0" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
            No recent activity.
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  userService = inject(UserService);
  websiteService = inject(WebsiteService);
  auditService = inject(AuditService);
}
