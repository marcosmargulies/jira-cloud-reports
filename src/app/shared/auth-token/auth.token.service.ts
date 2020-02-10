import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  AccessToken,
  TokenResources
} from 'src/app/models/access-token.model';
import { LocalStorageService } from '../local-storage/local.storage.service';
import { environment } from 'src/environments/environment';

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
  get hasToken() {
    return this.localStorageService.getTokenOnLocalStorage() != null;
  }

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

  public RefreshToken(): Observable<AccessToken> {
    if (!this.hasToken) {
      return;
    }
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
        refresh_token: this.localStorageService.getTokenOnLocalStorage()
          .refresh_token
      },
      httpHeaders
    );
  }
}
