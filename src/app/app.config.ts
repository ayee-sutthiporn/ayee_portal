import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideKeycloak } from 'keycloak-angular';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    ...(typeof window !== 'undefined' ? [provideKeycloak({
      config: {
        url: 'https://auth.sutthiporn.dev',
        realm: 'portal.sutthiporn',
        clientId: 'portal-sutthiporn.id'
      },
      initOptions: {
        checkLoginIframe: false
      }
    })] : [])
  ]
};
