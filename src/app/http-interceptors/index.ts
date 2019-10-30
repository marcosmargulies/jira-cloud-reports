/* "Barrel" of Http Interceptors */
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RefreshTokenInterceptor } from './interceptor/token-interceptor.service';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true }
];
