import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User, Role } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'users';

  users = signal<User[]>([]);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUsers();
    }
  }

  private loadUsers() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.users.set(JSON.parse(stored));
    } else {
      // Initialize with default admin if empty
      const defaultAdmin: User = {
        id: '1',
        username: 'admin',
        password: 'password', // In real app, this should be hashed
        role: Role.Admin,
        email: 'admin@example.com',
        createdAt: new Date()
      };
      this.users.set([defaultAdmin]);
      this.saveUsers();
    }
  }

  private saveUsers() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.users()));
    }
  }

  getUsers() {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users().find(u => u.id === id);
  }

  createUser(user: Omit<User, 'id' | 'createdAt'>) {
    const newUser: User = {
      ...user,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    this.users.update(users => [...users, newUser]);
    this.saveUsers();
  }

  updateUser(updatedUser: User) {
    this.users.update(users => users.map(u => u.id === updatedUser.id ? updatedUser : u));
    this.saveUsers();
  }

  deleteUser(id: string) {
    this.users.update(users => users.filter(u => u.id !== id));
    this.saveUsers();
  }
}
