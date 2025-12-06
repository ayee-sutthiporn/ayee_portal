import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import Keycloak from 'keycloak-js';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { User, Role } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private keycloak = inject(Keycloak);

  // Signal to track the current user
  currentUser = signal<User | null>(null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
        // Init is handled by APP_INITIALIZER in main.ts
        // Just rely on Keycloak instance state
        this.initUser();
    }
  }

  private async initUser() {
    try {
      if (this.keycloak.authenticated) {
        const profile = await this.keycloak.loadUserProfile();
        const user: User = {
          id: profile.id || 'unknown',
          username: profile.username || 'User',
          email: profile.email || '',
          role: this.keycloak.hasRealmRole('admin') ? Role.Admin : Role.User,
          createdAt: new Date() // Mock date
        };
        this.currentUser.set(user);
      } else {
        this.currentUser.set(null);
      }
    } catch (error) {
      console.error('Failed to initialize user', error);
      this.currentUser.set(null);
    }
  }

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }

  async isAuthenticated(): Promise<boolean> {
    return !!this.keycloak.authenticated;
  }

  getUserRole(): Role | undefined {
    return this.currentUser()?.role;
  }

  isAdmin(): boolean {
    return this.getUserRole() === Role.Admin;
  }

  login(): void {
    this.keycloak.login();
  }

  logout(): void {
    this.keycloak.logout({ redirectUri: window.location.origin });
    this.currentUser.set(null);
  }
}
