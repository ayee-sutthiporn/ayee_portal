import { ApplicationConfig, provideBrowserGlobalErrorListeners, APP_INITIALIZER, PLATFORM_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { isPlatformBrowser } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

function initializeKeycloak(keycloak: KeycloakService, platformId: object) {
  return () => {
    if (isPlatformBrowser(platformId)) {
      return keycloak.init({
        config: {
          url: 'https://auth.sutthiporn.dev',
          realm: 'portal.sutthiporn',
          clientId: 'portal-sutthiporn.id'
        },
        initOptions: {
          checkLoginIframe: true,
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
        },
        enableBearerInterceptor: true,
        bearerExcludedUrls: ['/assets']
      });
    }
    return Promise.resolve(false);
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideClientHydration(withEventReplay()),
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, PLATFORM_ID]
    }
  ]
};
