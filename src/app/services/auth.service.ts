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
    // Constructor handles minimal setup
  }

  public initialize(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      this.isDoneLoadingSubject.next(true);
      return Promise.resolve();
    }

    // Loop Prevention: Check if we recently failed silent refresh (SSO)
    // If we did, don't try again automatically until user manually logs in.
    if (sessionStorage.getItem('auth_sso_failed') === 'true') {
      console.warn('AuthService: Skipping SSO/Silent Refresh because of previous failure. User must login manually.');
      this.isDoneLoadingSubject.next(true);
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const authConfig: AuthConfig = {
        issuer: 'https://auth.sutthiporn.dev/realms/portal.sutthiporn',
        redirectUri: window.location.origin + '/callback',
        silentRefreshRedirectUri: window.location.origin + '/assets/silent-refresh.html',
        clientId: 'portal-sutthiporn.id',
        responseType: 'code',
        scope: 'openid profile email offline_access',
        showDebugInformation: true,
        requireHttps: false // Set to true in production if strictly HTTPS
      };

      console.log('AuthService: initialize() start');
      this.oauthService.setStorage(localStorage);
      this.oauthService.configure(authConfig);

      console.log('AuthService: Loading discovery document...');
      this.oauthService.loadDiscoveryDocument()
        .then(() => {
          console.log('AuthService: Discovery document loaded. Checking URL params...', window.location.search);
          console.log('AuthService: Full URL:', window.location.href);
          return this.oauthService.tryLoginCodeFlow();
        })
        .then(() => {
          console.log('AuthService: tryLoginCodeFlow completed.');
          if (this.oauthService.hasValidAccessToken()) {
            console.log('AuthService: Valid access token found. Loading profile...');
            this.handleLoginSuccess();
            this.isDoneLoadingSubject.next(true);
            resolve();
          } else {
            console.log('AuthService: No valid access token found. Trying silent refresh (SSO)...');
            // SSO Implementation: Try to silent refresh to check if session exists on IDP
            this.oauthService.silentRefresh()
              .then(() => {
                console.log('AuthService: Silent refresh successful. Logged in via SSO.');
                this.handleLoginSuccess();
                this.isDoneLoadingSubject.next(true);
                resolve();
              })
              .catch((err) => {
                console.log('AuthService: Silent refresh failed/no session.', err);

                // Silent refresh failed means user is not logged in (or session expired). 
                // We do NOT redirect to login here, we just finish loading as unauthenticated.
                // The GuestGuard or AuthGuard will handle routing if needed.

                this.isDoneLoadingSubject.next(true);
                resolve();
              });
          }
        })
        .catch((err) => {
          console.error('AuthService: Initialization error', err);

          // Auto-recovery: If nonce/state is invalid (likely due to loop/stale storage), clear it.
          // ALSO catch code_error or standard login_required errors on callback which might hang the app
          if (err && (err.type === 'invalid_nonce_in_state' || JSON.stringify(err).includes('invalid_nonce_in_state'))) {
            console.warn('AuthService: Invalid nonce detected. Clearing storage to recover.');
            this.oauthService.logOut(true); // true = no redirect, just clear storage
          }

          // If we are on the callback page and failed, redirect to home to clear the error state URL
          if (window.location.pathname.includes('callback')) {
            console.warn('AuthService: Login callback failed. Redirecting to home to clear state.');
            this.router.navigate(['/']);
          }

          this.isDoneLoadingSubject.next(true);
          resolve(); // Resolve even on error to not block app startup
        });

      // Subscribe to events
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
    });
  }

  // Helper to handle actions after successful login (initial or silent)
  private handleLoginSuccess() {
    // Clear the failure flag since we are now logged in
    sessionStorage.removeItem('auth_sso_failed');

    this.loadUserProfile();
    this.oauthService.setupAutomaticSilentRefresh();
    // If we are on the callback page, redirect to home
    if (window.location.pathname.includes('callback')) {
      this.router.navigate(['/']);
    }
  }

  // private configureOAuth not needed anymore, logic moved to initialize

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
    // Check Realm Roles
    if (claims.realm_access?.roles?.includes('admin')) {
      return true;
    }
    // Check Client Roles (ระวัง key ที่มี . อาจต้องเข้าถึงแบบ string index)
    const clientRoles = claims.resource_access?.['portal-sutthiporn.id']?.roles;
    if (clientRoles?.includes('admin')) {
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
    // User explicitly wants to login, clear any failure flags
    sessionStorage.removeItem('auth_sso_failed');
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
