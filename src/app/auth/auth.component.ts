import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthTokenService, LocalStorageService } from '../shared/index';
import { AccessToken } from '../models/access-token.module';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  constructor(
    private localStorageService: LocalStorageService,
    private tokenService: AuthTokenService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const code = this.route.snapshot.queryParams['code'];

    let token: AccessToken;

    if (this.tokenService.isAutorized) {
      this.router.navigate(['/', 'report']);
    } else {
      this.tokenService.GetBearerToken(code).subscribe(res => {
        token = res;

        this.tokenService.GetResources(token.access_token).subscribe(p => {
          token.resources = p;
          this.localStorageService.storeTokenOnLocalStorage(token);

          this.router.navigate(['/', 'report']);
        });
      });
    }
  }
}
