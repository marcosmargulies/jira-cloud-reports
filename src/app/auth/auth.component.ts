import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthTokenService, LocalStorageService } from "../shared/index";
import {
  AccessToken,
  LocalStorageTypeEnum
} from "../models/access-token.model";
import { switchMap } from "rxjs/operators";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"]
})
export class AuthComponent implements OnInit {
  constructor(
    private localStorageService: LocalStorageService,
    private tokenService: AuthTokenService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const code = this.route.snapshot.queryParamMap.get("code");

    let token: AccessToken;

    if (this.tokenService.isAutorized) {
      this.router.navigate(["/", "report"]);
    } else {
      let x = this.tokenService
        .GetBearerToken(code)
        .pipe(
          switchMap(t => {
            token = t;
            return this.tokenService.GetResources(t.access_token);
          })
        )
        .subscribe(p => {
          token.resources = p;
          this.localStorageService.storeAuthenticationTokenOnLocalStorage(
            token
          );

          // TODO change to subscription
          window.location.reload();
          //this.router.navigate(['/', 'report']);
        });
    }
  }
}
