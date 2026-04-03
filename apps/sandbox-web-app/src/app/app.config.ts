import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {provideMonacoEditor} from "ngx-monaco-editor-v2"
import {provideIcons} from "@ng-icons/core";
import {heroArchiveBox, heroHome} from "@ng-icons/heroicons/outline";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideMonacoEditor({baseUrl: 'public/monaco'}),
    provideIcons({ heroHome, heroArchiveBox })
  ],
};
