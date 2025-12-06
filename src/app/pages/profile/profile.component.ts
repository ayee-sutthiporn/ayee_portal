import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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

        <form [formGroup]="passwordForm" (ngSubmit)="onChangePassword()" class="space-y-6 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h4 class="text-lg font-medium text-gray-900 dark:text-white">Change Password</h4>
          
          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
            <input type="password" id="newPassword" formControlName="newPassword" 
                   class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm p-2 border">
            <div *ngIf="passwordForm.get('newPassword')?.touched && passwordForm.get('newPassword')?.invalid" class="text-red-500 text-xs mt-1">Password is required (min 6 chars)</div>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
            <input type="password" id="confirmPassword" formControlName="confirmPassword" 
                   class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm p-2 border">
            <div *ngIf="passwordForm.hasError('mismatch') && passwordForm.get('confirmPassword')?.touched" class="text-red-500 text-xs mt-1">Passwords do not match</div>
          </div>

          <div class="flex justify-end">
            <button type="submit" [disabled]="passwordForm.invalid" 
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed">
              Update Password
            </button>
          </div>

          <div *ngIf="message" [class]="isError ? 'text-red-600' : 'text-green-600'" class="text-sm text-center">
            {{ message }}
          </div>
        </form>
      </div>
    </div>
  `
})
export class ProfileComponent {
  authService = inject(AuthService);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);

  passwordForm: FormGroup;
  message = '';
  isError = false;

  constructor() {
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onChangePassword() {
    if (this.passwordForm.valid) {
      const currentUser = this.authService.currentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, password: this.passwordForm.get('newPassword')?.value };
        this.userService.updateUser(updatedUser);
        this.message = 'Password updated successfully';
        this.isError = false;
        this.passwordForm.reset();
      } else {
        this.message = 'User not found';
        this.isError = true;
      }
    }
  }
}
