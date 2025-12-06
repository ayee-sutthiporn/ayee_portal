import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h2>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center space-x-4 mb-6">
          <div class="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
            {{ authService.currentUser()?.username?.charAt(0)?.toUpperCase() }}
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ authService.currentUser()?.username }}</h3>
            <p class="text-gray-500 dark:text-gray-400">{{ authService.currentUser()?.email }}</p>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mt-1">
              {{ authService.currentUser()?.role }}
            </span>
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Account Management</h4>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Manage your account settings, including password, profile details, and sessions directly in Keycloak.
          </p>
          
          <button (click)="manageAccount()" 
                  class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            Manage Account / Change Password
          </button>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent {
  authService = inject(AuthService);

  manageAccount() {
    this.authService.manageAccount();
  }
}
