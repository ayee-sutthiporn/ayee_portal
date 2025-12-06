import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideKeycloak } from 'keycloak-angular';

const browserConfig: ApplicationConfig = {
  providers: [
    provideKeycloak({
      config: {
        url: 'https://auth.sutthiporn.dev',
        realm: 'ayee-portal',
        clientId: 'portal-sutthiporn.id'
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        checkLoginIframe: false
      }
    })
  ]
};

bootstrapApplication(AppComponent, mergeApplicationConfig(appConfig, browserConfig))
  .catch((err) => console.error(err));
