import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { KeycloakBearerInterceptor, KeycloakService } from 'keycloak-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ErrorInterceptor } from './config/error.interceptor';
import { PopupService } from './services/popup.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    },
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    importProvidersFrom([BrowserAnimationsModule]),
    KeycloakService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
      deps: [PopupService]
    }
  ]
};

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'https://proxy-onestar3gram:8080',
        realm: 'OneStar3gram',
        clientId: 'onestar3gram-frontend'
      },
      initOptions: {
        checkLoginIframe: false,
        onLoad: 'check-sso', // 'login-required' , 'check-sso'
      },
      enableBearerInterceptor: true,
      bearerPrefix: 'Bearer'
    });
}