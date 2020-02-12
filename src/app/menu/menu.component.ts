import { Component, OnInit } from "@angular/core";
import { ProfileService } from "../shared/profile/profile.service";
import { map } from "rxjs/internal/operators/map";
import { Profile } from "../models/profile.model";
import { Url } from "url";
import { LocalStorageService } from "../shared";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"]
})
export class MenuComponent implements OnInit {
  profile: Profile;

  constructor(
    private profileService: ProfileService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.localStorageService.getTokenOnLocalStorage()) {
      this.profileService
        .getProfile()
        .pipe(map(response => response))
        .subscribe(data => {
          this.profile = data;
          //console.log(data.emailAddress);
        });
    }
  }

  logout() {
    this.localStorageService.clearToken();
    this.profile = null;
    this.router.navigate(["/", "home"]);
  }

  login() {
    let YOUR_USER_BOUND_VALUE = this.makeid(16);
    let link = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${environment.clientId}&scope=read%3Ajira-user%20read%3Ajira-work%20offline_access&redirect_uri=${environment.redirectUrl}&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent`;

    window.location.href = link;
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
