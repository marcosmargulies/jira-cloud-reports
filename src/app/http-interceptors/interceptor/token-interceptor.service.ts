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
import { Router, ActivatedRoute, Params } from '@angular/router';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  constructor(
    private localStorage: LocalStorageService,
    private authService: AuthTokenService,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token = this.localStorage.getTokenOnLocalStorage();

    return next.handle(req).pipe(
      catchError(err => {
        console.log('Catching Error');
        console.log(err);

        let errorList: Array<number> = [400, 403];
        if (errorList.includes(err.status)) {
          this.localStorage.clearToken();
        }
        if (!this.localStorage.getTokenOnLocalStorage()) {
          this.router.navigate(['/', 'home']);
        }

        if (err.status === 401) {
          if (err.error.message == 'Token is exp') {
            //Genrate params for token refreshing
            let params = {
              token: token,
              refreshToken: token.refresh_token
            };

            // this.authService.RefreshToken(token.refresh_token).pipe(
            //   flatMap((response, any) => {
            //     req = req.clone({
            //       //               setHeaders: {
            //       //                 'api-token': data.result.token
            //                      });
            //                      return req
            //     // return next.handle(req).pipe(
            //     //   catchError(error => {
            //     //     //               //Catch another error
            //     //   })
            //     // );
            //   })
            // );
            //return this.authService.RefreshToken(token.refresh_token).pipe(flatMap(data:any)=>{});
            //       return this.http.post('localhost:8080/auth/refresh', params).flatMap(
            //         (data: any) => {
            //           //If reload successful update tokens
            //           if (data.status == 200) {
            //             //Update tokens
            //             localStorange.setItem("api-token", data.result.token);
            //             localStorange.setItem("refreshToken", data.result.refreshToken);
            //             //Clone our fieled request ant try to resend it
            //             req = req.clone({
            //               setHeaders: {
            //                 'api-token': data.result.token
            //               }
            //             });
            //             return next.handle(req).catch(err => {
            //               //Catch another error
            //             });
            //           }else {
            //             //Logout from account
            //           }
            //         }
            //       );
          } else {
            //Logout from account or do some other stuff
          }
        }
        return throwError(err);
      })
      // catchError(err => {
      //   console.log(err);
      //   console.log(err.status);
      //   if (err.status === 401) {
      //     if (err.error.message == 'Unauthorized') {
      //       return this.authService
      //         .RefreshToken(token.refresh_token)
      //         .subscribe(res => {
      //           console.log('new token:');
      //           console.log(res);
      //           token.access_token = res.access_token;
      //           this.localStorage.storeTokenOnLocalStorage(token);

      //           req = req.clone({
      //             setHeaders: {
      //               Authorization: token.token_type + ' ' + token.access_token
      //             }
      //           });

      //           return next.handle(req).subscribe(r => {
      //             console.log('new request??');
      //             console.log(r);
      //           });
      //         });

      //       //TODO: Token refreshing
      //       console.log('TODO: Token refreshing');
      //     } else {
      //       //Logout from account or do some other stuff
      //       console.log('TODO: Logout from account or do some other stuff');
      //     }
      //   }

      //   return throwError(err);
      // })
    );
  }
}
