export enum LocalStorageTypeEnum {
  Authentication,
  Settings
}

export class AccessToken {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  refresh_token: string;
  resources: TokenResources[];
}

export class TokenResources {
  id: string;
  url: string;
  name: string;
  scopes: string[];
  avatarUrl: string;
}

export interface MenuSettingsDialogData {
  isOAuthEnabled: boolean;
  isAuthenticated: boolean;
  url: string;
  instanceAuthorized: TokenResources[];
  instanceSelected: string;
}
