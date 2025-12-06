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
        realm: 'portal.sutthiporn',
        clientId: 'portal-sutthiporn.id'
      }
    })
  ]
};

bootstrapApplication(AppComponent, mergeApplicationConfig(appConfig, browserConfig))
  .catch((err) => console.error(err));
