import { Component, OnInit } from "@angular/core";
import { environment } from "../../environments/environment";
import { AuthTokenService, LocalStorageService } from "../shared/index";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  YOUR_USER_BOUND_VALUE = "my key goes here";
  link = "";

  constructor(
    private tokenService: AuthTokenService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (
      this.tokenService.isAutorized ||
      (this.localStorageService.getSettingsOnLocalStorage() &&
        !this.localStorageService.getSettingsOnLocalStorage().isOAuthEnabled)
    ) {
      this.router.navigate(["/", "report"]);
    } else {
      this.YOUR_USER_BOUND_VALUE = this.makeid(16);
      this.link = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${environment.clientId}&scope=read%3Ajira-user%20read%3Ajira-work%20offline_access&redirect_uri=${environment.redirectUrl}&state=${this.YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent`;
      //window.location.href = this.link;
    }
  }

  login() {
    window.location.href = this.link;
  }

  logout() {}

  get givenName() {
    return null;
  }

  private makeid(length: number) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
