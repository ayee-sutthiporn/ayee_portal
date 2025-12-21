import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { User, Role } from '../models/models';
import { environment } from '../../environments/environment';

interface UserClaims {
  sub: string;
  preferred_username?: string;
  name?: string;
  email?: string;
  realm_access?: { roles?: string[] };
  resource_access?: Record<string, { roles?: string[] }>;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private oauthService = inject(OAuthService);
  private http = inject(HttpClient);
  private readonly ACTION_URL = `${environment.apiUrl}/users/sync`;

  // Signal to track the current user
  currentUser = signal<User | null>(null);

  private isDoneLoadingSubject = new BehaviorSubject<boolean>(false);
  public isDoneLoading$ = this.isDoneLoadingSubject.asObservable();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.configureOAuth();
    } else {
      // If server, we are "done" loading immediately (as we don't do the full init)
      this.isDoneLoadingSubject.next(true);
    }
  }

  private configureOAuth() {
    const authConfig: AuthConfig = {
      issuer: 'https://auth.sutthiporn.dev/realms/portal.sutthiporn',
      redirectUri: window.location.origin + '/',
      clientId: 'portal-sutthiporn.id',
      responseType: 'code',
      scope: 'openid profile email offline_access',
      showDebugInformation: true,
      requireHttps: false // Set to true in production if strictly HTTPS
    };

    this.oauthService.configure(authConfig);
    this.oauthService.setupAutomaticSilentRefresh();

    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oauthService.hasValidAccessToken()) {
        this.loadUserProfile();
      }
      this.isDoneLoadingSubject.next(true);
    }).catch(() => this.isDoneLoadingSubject.next(true));

    // Subscribe to events to keep user state updated
    this.oauthService.events.subscribe(e => {
      if (e.type === 'token_received' || e.type === 'discovery_document_loaded') {
        if (this.oauthService.hasValidAccessToken()) {
          this.loadUserProfile();
        }
      }
      if (e.type === 'logout') {
        this.currentUser.set(null);
      }
    });
  }

  private async loadUserProfile() {
    const claims = this.oauthService.getIdentityClaims() as UserClaims;
    if (claims) {
      // Check roles - Keycloak puts resource_access or realm_access in claims
      // Adjust based on your token structure.
      // Example: claims.realm_access.roles.includes('admin')
      const isAdmin = this.checkAdminRole(claims);

      const user: User = {
        id: claims.sub,
        username: claims.preferred_username || claims.name || 'User',
        email: claims.email || '',
        role: isAdmin ? Role.Admin : Role.User,
        createdAt: new Date()
      };

      this.currentUser.set(user);
      this.syncUser();
    }
  }

  private checkAdminRole(claims: UserClaims): boolean {
    if (claims.realm_access?.roles?.includes('admin')) {
      return true;
    }
    if (claims.resource_access?.['portal-sutthiporn.id']?.roles?.includes('admin')) {
      return true;
    }
    return false;
  }

  private syncUser() {
    this.http.post(this.ACTION_URL, {}).subscribe({
      next: () => console.log('User synced successfully'),
      error: (err) => console.error('Failed to sync user', err)
    });
  }

  isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  async isAuthenticated(): Promise<boolean> {
    await firstValueFrom(this.isDoneLoading$.pipe(filter(isDone => isDone)));
    return this.isLoggedIn();
  }

  getUserRole(): Role | undefined {
    return this.currentUser()?.role;
  }

  isAdmin(): boolean {
    return this.getUserRole() === Role.Admin;
  }

  manageAccount(): void {
    // Redirect to Keycloak account page or similar
    window.location.href = 'https://auth.sutthiporn.dev/realms/portal.sutthiporn/account';
  }

  login(): void {
    this.oauthService.initCodeFlow();
  }

  logout(): void {
    this.oauthService.logOut();
    this.currentUser.set(null);
  }

  getAccessToken(): string {
    return this.oauthService.getAccessToken();
  }
}
