import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AccessToken } from 'src/app/models/access-token.module';

@Injectable()
export class LocalStorageService {
  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {}
  public STORAGE_TOKEN = 'JIRA-Auth-Token';
  public storeTokenOnLocalStorage(token: AccessToken): void {
    this.storage.set(this.STORAGE_TOKEN, token);
  }

  updateToken(tokenCode: string) {
    let token: AccessToken = this.storage.get(this.STORAGE_TOKEN);
    token.access_token = tokenCode;
    this.storeTokenOnLocalStorage(token);
  }

  public getTokenOnLocalStorage(): AccessToken {
    return this.storage.get(this.STORAGE_TOKEN);
  }

  public clearToken(): void {
    this.storage.remove(this.STORAGE_TOKEN);
  }
}
