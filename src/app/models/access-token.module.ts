export class AccessToken {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  resources: TokenResources[];
}

export class TokenResources {
  id: string;
  name: string;
  scopes: string[];
  avatarUrl: string;
}
