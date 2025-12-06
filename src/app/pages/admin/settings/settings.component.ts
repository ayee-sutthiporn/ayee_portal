import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h2>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
          
          <!-- Site Name -->
          <div>
            <label for="siteName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Site Name</label>
            <input type="text" id="siteName" formControlName="siteName" 
                   class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm p-2 border">
          </div>

          <!-- Default Theme -->
          <div>
            <label for="defaultTheme" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Default Theme</label>
            <select id="defaultTheme" formControlName="defaultTheme" 
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm p-2 border">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <!-- Maintenance Mode -->
          <div class="flex items-center">
            <input type="checkbox" id="maintenanceMode" formControlName="maintenanceMode" 
                   class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded">
            <label for="maintenanceMode" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">Maintenance Mode</label>
          </div>

          <!-- Actions -->
          <div class="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <button type="submit" [disabled]="form.invalid || !form.dirty" 
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed">
              Save Changes
            </button>
          </div>
          
          <div *ngIf="saved" class="text-green-600 text-sm text-center">Settings saved successfully!</div>
        </form>
      </div>
    </div>
  `
})
export class SettingsComponent {
  private fb = inject(FormBuilder);
  private settingsService = inject(SettingsService);

  form: FormGroup;
  saved = false;

  constructor() {
    const currentSettings = this.settingsService.settings();
    this.form = this.fb.group({
      siteName: [currentSettings.siteName, Validators.required],
      maintenanceMode: [currentSettings.maintenanceMode],
      defaultTheme: [currentSettings.defaultTheme]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.settingsService.updateSettings(this.form.value);
      this.saved = true;
      setTimeout(() => this.saved = false, 3000);
      this.form.markAsPristine();
    }
  }
}
