import { Inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError, first } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  AccessToken,
  TokenResources
} from 'src/app/models/access-token.module';
import { LocalStorageService } from '../local-storage/local.storage.service';
import { environment } from 'src/environments/environment';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

@Injectable({
  providedIn: 'root'
})
export class AuthTokenService {
  authUrl: string = 'https://auth.atlassian.com/oauth/token';
  resourcesUrl: string =
    'https://api.atlassian.com/oauth/token/accessible-resources';

  grantType: string = 'authorization_code';

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  get isAutorized() {
    return this.localStorageService.getTokenOnLocalStorage() != null;
  }

  // public getTokenByCode(code: string): AccessToken {
  //   let token: AccessToken;
  //   this.GetBearerToken(code).subscribe(res => {
  //     token = res;

  //     this.GetResources(token.access_token).subscribe(p => {
  //       token.resources = p;
  //       this.localStorageService.storeTokenOnLocalStorage(token);
  //     });
  //   });

  //   return token;
  // }

  // public refreshToken(): AccessToken {
  //   let token = this.localStorageService.getTokenOnLocalStorage();
  //   this.RefreshToken('token.resources').subscribe(res => {
  //     token = res;
  //   });

  //   return token;
  // }

  public GetBearerToken(code: string): Observable<AccessToken> {
    const httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<AccessToken>(
      this.authUrl,
      {
        grant_type: this.grantType,
        client_id: environment.clientId,
        client_secret: environment.clientSecret,
        code: code,
        redirect_uri: environment.redirectUrl
      },
      httpHeaders
    );
  }

  public GetResources(token: string): Observable<TokenResources[]> {
    const httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token
      })
    };
    return this.http.get<TokenResources[]>(this.resourcesUrl, httpHeaders);
  }

  public RefreshToken(refreshToken: string): Observable<AccessToken> {
    const httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<AccessToken>(
      this.authUrl,
      {
        grant_type: 'refresh_token',
        client_id: environment.clientId,
        client_secret: environment.clientSecret,
        refresh_token: refreshToken
      },
      httpHeaders
    );
  }
}
