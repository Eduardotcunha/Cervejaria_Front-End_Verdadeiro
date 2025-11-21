import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
// REMOVA: import { provideRouter } from '@angular/router'; 
// REMOVA: import { routes } from './app/app.routes'; 

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));