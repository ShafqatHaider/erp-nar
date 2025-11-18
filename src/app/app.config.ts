import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './Auth/auth.interceptor';
import { DatePipe } from '@angular/common';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
     provideHttpClient(
      withInterceptors([authInterceptor]),
      
      
    ),
    DatePipe,
    provideAnimations(), // required animations providers
    provideToastr(
      {
      timeOut: 3000,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
      iconClasses : {
  error: 'toast-error',
  info: 'toast-info',
  success: 'toast-success',
  warning: 'toast-warning',
}
    }
    ),
  ]
};
