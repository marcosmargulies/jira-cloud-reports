import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'JIRA Reports';

  constructor() {
    // // URL of the SPA to redirect the user to after login
    // this.oauthService.redirectUri = window.location.origin + '/report';
    // // The SPA's id. The SPA is registerd with this id at the auth-server
    // this.oauthService.clientId = 'JIRA Reports';
    // // set the scope for the permissions the client should request
    // // The first three are defined by OIDC. The 4th is a usecase-specific one
    // this.oauthService.scope = 'read:jira-work read:jira-user';
    // // set to true, to receive also an id_token via OpenId Connect (OIDC) in addition to the
    // // OAuth2-based access_token
    // this.oauthService.oidc = false; // ID_Token
    // // Use setStorage to use sessionStorage or another implementation of the TS-type Storage
    // // instead of localStorage
    // this.oauthService.setStorage(sessionStorage);
    // // Discovery Document of your AuthServer as defined by OIDC
    // let url =
    //   'https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=q8Col6WgOUFIot7VpryyJYPCajB7zioc&scope=read%3Ajira-user%20read%3Ajira-work&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2F&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent';
    // //'https://steyer-identity-server.azurewebsites.net/identity/.well-known/openid-configuration';
    // return;
    // // Load Discovery Document and then try to login the user
    // this.oauthService.loadDiscoveryDocument(url).then(() => {
    //   // This method just tries to parse the token(s) within the url when
    //   // the auth-server redirects the user back to the web-app
    //   // It dosn't send the user the the login page
    //   this.oauthService.tryLogin({});
    // });
    /*this.oauthService.redirectUri = window.location.origin;
    this.oauthService.clientId = 'q8Col6WgOUFIot7VpryyJYPCajB7zioc';
    this.oauthService.scope = 'read:jira-work%20read:jira-user';
    this.oauthService.responseType = 'code';
    this.oauthService.redirectUri = 'http://localhost:4200/report';
    this.oauthService.state = 'somethinghere';*/
    // this.oauthService.issuer =
    //   'https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=q8Col6WgOUFIot7VpryyJYPCajB7zioc&scope=read:jira-work%20read:jira-user&redirect_uri=http://localhost:4200/&state=YOUR_USER_BOUND_VALUE&response_type=code&prompt=consent';
    // this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    // // Load Discovery Document and then try to login the user
    // this.oauthService.loadDiscoveryDocument().then(() => {
    //   this.oauthService.tryLogin();
    // });
    // this.oauthService.redirectUri = window.location.origin + '/report';
    // this.oauthService.clientId = 'q8Col6WgOUFIot7VpryyJYPCajB7zioc';
    // this.oauthService.scope = 'openid profile email';
    // this.oauthService.oidc = false;
    // this.oauthService.issuer =
    //   'https://auth.atlassian.com/authorize?audience=api.atlassian.com';
    // this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    // this.oauthService.loadDiscoveryDocumentAndTryLogin();
    // this.oauthService.loginUrl =
    //   'https://steyer-identity-server.azurewebsites.net/identity/connect/authorize'; //Id-Provider?
    // this.oauthService.logoutUrl =
    //   'https://steyer-identity-server.azurewebsites.net/identity/connect/endsession?id_token={{id_token}}';
    // this.oauthService.redirectUri = window.location.origin + '/report';
    // this.oauthService.clientId = 'spa-demo';
    // this.oauthService.scope = 'openid profile email voucher';
    // this.oauthService.issuer =
    //   'https://steyer-identity-server.azurewebsites.net/identity';
    // this.oauthService.oidc = true;
    //this.oauthService.tryLogin({});
  }
}
