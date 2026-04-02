import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {MonacoEditorModule, NgxMonacoEditorConfig, provideMonacoEditor} from "ngx-monaco-editor-v2"

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(appRoutes), provideMonacoEditor({baseUrl: 'public/monaco'})],
};
