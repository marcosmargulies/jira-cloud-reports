import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, flatMap, retry } from 'rxjs/operators';
import { LocalStorageService, AuthTokenService } from 'src/app/shared';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  constructor(
    private localStorage: LocalStorageService,
    private authService: AuthTokenService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token = this.localStorage.getTokenOnLocalStorage();

    let originalRequest = req.clone();

    return next.handle(req).pipe(
      catchError(err => {
        console.log(err);
        console.log(err.status);
        if (err.status === 401) {
          if (err.error.message == 'Unauthorized') {
            this.authService
              .RefreshToken(token.refresh_token)
              .subscribe(res => {
                console.log('new token:');
                console.log(res);
                token.access_token = res.access_token;
                this.localStorage.storeTokenOnLocalStorage(token);

                req = originalRequest.clone({
                  setHeaders: {
                    Authorization: token.token_type + ' ' + token.access_token
                  }
                });
                return next.handle(req).subscribe(r => console.log(r));

                // originalRequest.clone();

                // const authReq = req.clone({
                //   headers: req.headers.set(
                //     'Authorization',
                //     token.token_type + ' ' + token.access_token
                //   )
                // });

                // // send cloned request with header to the next handler.
                // return next.handle(authReq).pipe();
              });

            //TODO: Token refreshing
            console.log('TODO: Token refreshing');
          } else {
            //Logout from account or do some other stuff
            console.log('TODO: Logout from account or do some other stuff');
          }
        }

        return throwError(err);
      })
    );
  }
}
