import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AccessToken } from 'src/app/models/access-token.module';

const STORAGE_TOKEN = 'access_token';

@Injectable()
export class LocalStorageService {
  anotherTodolist = [];

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {}

  public storeTokenOnLocalStorage(token: AccessToken): void {
    //const storedToken = this.storage.get(STORAGE_TOKEN) || [];

    this.storage.set(STORAGE_TOKEN, token);
    console.log('Local Storage:');
    console.log(this.storage.get(STORAGE_TOKEN) || 'LocaL storage is empty');
  }

  public getTokenOnLocalStorage(): AccessToken {
    return this.storage.get(STORAGE_TOKEN);
  }
}
