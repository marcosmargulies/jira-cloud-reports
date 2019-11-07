import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AccessToken } from 'src/app/models/access-token.module';

@Injectable()
export class LocalStorageService {
  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {}
  public STORAGE_TOKEN = 'JIRA-Auth-Token';
  public storeTokenOnLocalStorage(token: AccessToken): void {
    //const storedToken = this.storage.get(STORAGE_TOKEN) || [];

    this.storage.set(this.STORAGE_TOKEN, token);
    // console.log('Local Storage:');
    // console.log(
    //   this.storage.get(this.STORAGE_TOKEN) || 'LocaL storage is empty'
    // );
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
    this.storage.clear();
  }
}
