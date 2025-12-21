import { mergeApplicationConfig, ApplicationConfig, Injectable, inject, signal } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { Router } from '@angular/router';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from './services/auth.service';
import { User } from './models/models';

// Mock OAuthService for SSR if needed, usually mostly no-op
class MockOAuthService {
  configure() {
    // no-op
  }
  setupAutomaticSilentRefresh() {
    // no-op
  }
  loadDiscoveryDocumentAndTryLogin() { return Promise.resolve(false); }
  hasValidAccessToken() { return false; }
  getIdentityClaims() { return {}; }
  getAccessToken() { return ''; }
  initCodeFlow() {
    // no-op
  }
  logOut() {
    // no-op
  }
  events = {
    subscribe: () => {
      // no-op
    }
  };
}

@Injectable()
class ServerAuthService {
  private router = inject(Router);
  currentUser = signal<User | null>(null);

  // Always return false for auth check on server
  isAuthenticated(): Promise<boolean> {
    return Promise.resolve(false);
  }

  // Handle the login call from the guard by redirecting to /login route
  login(): void {
    this.router.navigate(['/login']);
  }

  // No-ops for other methods
  isLoggedIn() { return false; }
  getUserRole() { return undefined; }
  isAdmin() { return false; }
  manageAccount() {
    // no-op
  }
  logout() {
    // no-op
  }
  getAccessToken() { return ''; }
}

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    // Mock OAuthService to avoid SSR issues with storage/window
    { provide: OAuthService, useClass: MockOAuthService },
    // Override AuthService on server to handle redirects gracefully
    { provide: AuthService, useClass: ServerAuthService }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
