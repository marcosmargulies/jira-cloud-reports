import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { throwError, Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthTokenService, LocalStorageService } from 'src/app/shared/index';
import { AccessToken } from 'src/app/models/access-token.module';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthTokenService,
    private localStorage: LocalStorageService
  ) {}

  private AUTH_HEADER = 'Authorization';
  private token: AccessToken = null;
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //TODO change to constants
    if (!req.url.includes('api.atlassian.com/ex/jira')) {
      return next.handle(req);
    }
    console.warn('AuthInterceptor');
    if (!req.headers.has('Content-Type')) {
      req = req.clone({
        headers: req.headers.set('Content-Type', 'application/json')
      });
    }
    this.token = this.localStorage.getTokenOnLocalStorage();
    req = this.addAuthenticationToken(req);

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn('Error ' + error.status);
        if (error && (error.status === 400 || error.status === 401)) {
          // 400 errors are most likely wrong token or expired.
          // 401 errors are most likely going to be because we have an expired token that we need to refresh.
          if (this.refreshTokenInProgress) {
            // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
            // which means the new token is ready and we can retry the request again
            return this.refreshTokenSubject.pipe(
              filter(result => result !== null),
              take(1),
              switchMap(() => next.handle(this.addAuthenticationToken(req)))
            );
          } else {
            this.refreshTokenInProgress = true;

            // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
            this.refreshTokenSubject.next(null);

            return this.refreshAccessToken().pipe(
              switchMap((success: AccessToken) => {
                // When the call to refreshToken completes we reset the refreshTokenInProgress to false
                // for the next time the token needs to be refreshed
                this.token = success;
                this.localStorage.updateToken(this.token.access_token);
                this.refreshTokenInProgress = false;
                this.refreshTokenSubject.next(success);

                return next.handle(this.addAuthenticationToken(req));
              }),
              catchError((err: any) => {
                this.refreshTokenInProgress = false;
                return throwError(error);
              })
            );
          }
        } else {
          return throwError(error);
        }
      })
    );
  }

  private refreshAccessToken(): Observable<any> {
    return this.authService.RefreshToken();
  }

  private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({
      headers: request.headers.set(
        this.AUTH_HEADER,
        `${this.token.token_type} ${this.token.access_token}`
      )
    });
  }
}
