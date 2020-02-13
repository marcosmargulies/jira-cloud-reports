import { Inject, Injectable } from "@angular/core";
import { LOCAL_STORAGE, StorageService } from "ngx-webstorage-service";
import {
  AccessToken,
  MenuSettingsDialogData,
  LocalStorageTypeEnum
} from "src/app/models/access-token.model";

@Injectable()
export class LocalStorageService {
  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {}
  public STORAGE_AUTH_TOKEN = "JIRA-Cloud-Reports-Auth-Token";
  public STORAGE_SETTINGS_TOKEN = "JIRA-Cloud-Reports-Settings-Token";

  private storeTokenOnLocalStorage(
    token: AccessToken,
    type: LocalStorageTypeEnum
  ): void {
    this.storage.set(this.enumToKey(type), token);
  }

  private updateToken(tokenCode: string, type: LocalStorageTypeEnum) {
    let token: AccessToken = this.storage.get(this.enumToKey(type));
    token.access_token = tokenCode;
    this.storeTokenOnLocalStorage(token, type);
  }

  public storeAuthenticationTokenOnLocalStorage(token: AccessToken): void {
    this.storage.set(this.STORAGE_AUTH_TOKEN, token);
  }

  public storeSettingsOnLocalStorage(token: AccessToken): void {
    this.storage.set(this.STORAGE_SETTINGS_TOKEN, token);
  }

  public updateAuthenticationToken(tokenCode: string) {
    let token: AccessToken = this.storage.get(this.STORAGE_AUTH_TOKEN);
    token.access_token = tokenCode;
    this.storeAuthenticationTokenOnLocalStorage(token);
  }

  public getAuthenticationTokenOnLocalStorage(): AccessToken {
    return this.storage.get(this.STORAGE_AUTH_TOKEN);
  }
  public getSettingsOnLocalStorage(): MenuSettingsDialogData {
    return this.storage.get(this.STORAGE_SETTINGS_TOKEN);
  }

  public clearAuthenticationToken(): void {
    this.storage.remove(this.STORAGE_AUTH_TOKEN);
  }

  public getJiraRestAddress(): string {
    let token = this.getAuthenticationTokenOnLocalStorage();
    let settings = this.getSettingsOnLocalStorage();
    let jiraUrl = "";
    if (!settings || (settings.isOAuthEnabled && !settings.instanceSelected)) {
      jiraUrl = `https://api.atlassian.com/ex/jira/${token.resources[0].id}/rest/api/3/`;
    } else if (settings.isOAuthEnabled && settings.instanceSelected) {
      jiraUrl = `https://api.atlassian.com/ex/jira/${settings.instanceSelected}/rest/api/3/`;
    } else {
      jiraUrl = `https://${settings.url}/rest/api/2/`;
    }
    console.log(jiraUrl);
    return jiraUrl;
  }

  private enumToKey(type: LocalStorageTypeEnum): string {
    switch (type) {
      case LocalStorageTypeEnum.Settings:
        return this.STORAGE_AUTH_TOKEN;
      case LocalStorageTypeEnum.Settings:
      default:
        return this.STORAGE_SETTINGS_TOKEN;
    }
  }
}
