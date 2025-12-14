import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { User, Role } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private keycloakService = inject(KeycloakService);
  private http = inject(HttpClient);
  private readonly ACTION_URL = `${environment.apiUrl}/users/sync`;

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
      if (await this.keycloakService.isLoggedIn()) {
        const profile = await this.keycloakService.loadUserProfile();
        const user: User = {
          id: profile.id || 'unknown',
          username: profile.username || 'User',
          email: profile.email || '',
          role: this.keycloakService.isUserInRole('admin') ? Role.Admin : Role.User,
          createdAt: new Date() // Mock date, normally from sync
        };
        this.currentUser.set(user);
        this.syncUser();
      } else {
        this.currentUser.set(null);
      }
    } catch (error) {
      console.error('Failed to initialize user', error);
      this.currentUser.set(null);
    }
  }

  private syncUser() {
    this.http.post(this.ACTION_URL, {}).subscribe({
      next: () => console.log('User synced successfully'),
      error: (err) => console.error('Failed to sync user', err)
    });
  }

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }

  async isAuthenticated(): Promise<boolean> {
    return this.keycloakService.isLoggedIn();
  }

  getUserRole(): Role | undefined {
    return this.currentUser()?.role;
  }

  isAdmin(): boolean {
    return this.getUserRole() === Role.Admin;
  }

  manageAccount(): void {
    this.keycloakService.getKeycloakInstance().accountManagement();
  }

  login(): void {
    this.keycloakService.login();
  }

  logout(): void {
    this.keycloakService.logout(window.location.origin);
    this.currentUser.set(null);
  }
}
