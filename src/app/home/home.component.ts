import { Component } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  YOUR_USER_BOUND_VALUE = 'my key goes here';
  link = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${environment.clientId}&scope=read%3Ajira-user%20read%3Ajira-work%20offline_access&redirect_uri=${environment.redirectUrl}&state=${this.YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent`;
  constructor() {}

  login() {
    window.location.href = this.link;
  }

  logout() {
    //this.oauthService.logOut();
  }

  get givenName() {
    //const claims = this.oauthService.getIdentityClaims();
    // if (!claims) {
    //   return null;
    // }
    // return claims['name'];
    return null;
  }
}
