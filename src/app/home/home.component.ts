import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  link =
    'https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=q8Col6WgOUFIot7VpryyJYPCajB7zioc&scope=read%3Ajira-user%20read%3Ajira-work%20offline_access&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fauth&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent';
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
