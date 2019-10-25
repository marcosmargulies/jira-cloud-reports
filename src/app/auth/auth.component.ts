import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthTokenService } from '../shared';
import { AccessToken } from '../models/access-token.module';
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  constructor(
    private tokenService: AuthTokenService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const code = this.route.snapshot.queryParams['code'];

    this.tokenService.getTokenByCode(code);

    //if (token != null) {
    this.router.navigate(['/', 'report']);
    //} else {
    //this.router.navigate(['/', 'home']);
    //}
    // http://localhost:4200/report
  }
}
