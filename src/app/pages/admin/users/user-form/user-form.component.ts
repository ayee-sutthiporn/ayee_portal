import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { User, Role } from '../../../../models/models';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ isEditMode ? 'Edit User' : 'Add User' }}</h2>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
          
          <!-- Username -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
            <input type="text" id="username" formControlName="username" 
                   class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm p-2 border">
            <div *ngIf="form.get('username')?.touched && form.get('username')?.invalid" class="text-red-500 text-xs mt-1">Username is required</div>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input type="email" id="email" formControlName="email" 
                   class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm p-2 border">
            <div *ngIf="form.get('email')?.touched && form.get('email')?.invalid" class="text-red-500 text-xs mt-1">Valid email is required</div>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password {{ isEditMode ? '(Leave blank to keep current)' : '' }}</label>
            <input type="password" id="password" formControlName="password" 
                   class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm p-2 border">
            <div *ngIf="form.get('password')?.touched && form.get('password')?.invalid" class="text-red-500 text-xs mt-1">Password is required</div>
          </div>

          <!-- Role -->
          <div>
            <label for="role" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
            <select id="role" formControlName="role" 
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm p-2 border">
              <option [value]="Role.User">User</option>
              <option [value]="Role.Admin">Admin</option>
            </select>
          </div>

          <!-- Avatar Upload -->
          <div>
            <label for="avatar" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Avatar</label>
            <div class="mt-1 flex items-center space-x-4">
              <div *ngIf="avatarPreview" class="relative w-16 h-16 rounded-full overflow-hidden border border-gray-200 dark:border-gray-600">
                <img [src]="avatarPreview" alt="Avatar Preview" class="w-full h-full object-cover">
                <button type="button" (click)="removeAvatar()" class="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-lg hover:bg-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
              <input type="file" id="avatar" (change)="onFileSelected($event)" accept="image/*"
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
            <a routerLink="/admin/users" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
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
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  
  Role = Role; // Expose enum to template

  form: FormGroup;
  isEditMode = false;
  userId: string | null = null;
  avatarPreview: string | null = null;

  constructor() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: [Role.User, Validators.required],
      avatar: ['']
    });
  }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.isEditMode = true;
      const user = this.userService.getUserById(this.userId);
      if (user) {
        this.form.patchValue({
          username: user.username,
          email: user.email,
          role: user.role,
          password: '', // Don't show password
          avatar: user.avatar
        });
        this.avatarPreview = user.avatar || null;
        this.form.get('password')?.clearValidators(); // Password optional on edit
        this.form.get('password')?.updateValueAndValidity();
      } else {
        this.router.navigate(['/admin/users']);
      }
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.form.patchValue({ avatar: base64String });
        this.avatarPreview = base64String;
      };
      reader.readAsDataURL(file);
    }
  }

  removeAvatar() {
    this.form.patchValue({ avatar: '' });
    this.avatarPreview = null;
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      if (this.isEditMode && this.userId) {
        const existingUser = this.userService.getUserById(this.userId)!;
        const updatedUser: User = {
          ...existingUser,
          username: formValue.username,
          email: formValue.email,
          role: formValue.role,
          avatar: formValue.avatar,
          // Only update password if provided
          password: formValue.password ? formValue.password : existingUser.password
        };
        this.userService.updateUser(updatedUser);
      } else {
        this.userService.createUser(formValue);
      }
      this.router.navigate(['/admin/users']);
    }
  }
}
