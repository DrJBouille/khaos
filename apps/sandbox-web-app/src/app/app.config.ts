import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {provideMonacoEditor} from "ngx-monaco-editor-v2"
import {provideIcons} from "@ng-icons/core";
import {heroArchiveBox, heroHome} from "@ng-icons/heroicons/outline";
import {provideKeycloakAngular} from "./keycloak.config";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {keycloakInterceptor} from "./core/interceptors/keycloak.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([keycloakInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideMonacoEditor({baseUrl: 'public/monaco'}),
    provideIcons({ heroHome, heroArchiveBox }),
    provideKeycloakAngular()
  ],
};
