import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

import { KeycloakService } from 'keycloak-angular';
import Keycloak from 'keycloak-js';

class MockKeycloakService {
  async isLoggedIn() {
    return false;
  }
  async loadUserProfile() {
    return {};
  }
  login() { return; }
  logout() { return; }
  isUserInRole() { return false; }
}

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    { provide: KeycloakService, useClass: MockKeycloakService },
    {
      provide: Keycloak,
      useValue: {
        init: () => Promise.resolve(false),
        authenticated: false,
        token: '',
        logout: () => Promise.resolve(),
        login: () => Promise.resolve(),
        loadUserProfile: () => Promise.resolve({}),
        hasRealmRole: () => false,
      } as unknown as Keycloak
    }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
