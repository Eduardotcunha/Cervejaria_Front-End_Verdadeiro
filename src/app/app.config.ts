// src/app/app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core'; 
import { provideRouter } from '@angular/router'; 
import { provideHttpClient } from '@angular/common/http'; 
import { ReactiveFormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http'; // Usaremos esta no importProvidersFrom

import { routes } from './app.routes'; 

export const appConfig: ApplicationConfig = {
  providers: [
    // 1. Provedor de Roteamento (Resolve o erro do 'router')
    provideRouter(routes), 
    
    // 2. Provedor de Forms (Resolve o erro do 'fb')
    // Usamos importProvidersFrom para injetar o FormBuilder do ReactiveFormsModule
    importProvidersFrom(ReactiveFormsModule),
    
    // 3. Provedor HTTP. O provideHttpClient() é o método moderno.
    // Ele cobre a funcionalidade do HttpClientModule.
    provideHttpClient() 
  ]
};