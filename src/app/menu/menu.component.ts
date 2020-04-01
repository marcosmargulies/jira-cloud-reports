import { Component, OnInit, Inject } from "@angular/core";
import { ProfileService } from "../shared/profile/profile.service";
import { map } from "rxjs/internal/operators/map";
import { Profile } from "../models/profile.model";
import { Url } from "url";
import { LocalStorageService } from "../shared";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef
} from "@angular/material/dialog";
import {
  AccessToken,
  MenuSettingsDialogData,
  LocalStorageTypeEnum
} from "../models/access-token.model";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"]
})
export class MenuComponent implements OnInit {
  profile: Profile;
  settings: MenuSettingsDialogData;
  token: AccessToken;

  constructor(
    private profileService: ProfileService,
    private localStorageService: LocalStorageService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.localStorageService.getAuthenticationTokenOnLocalStorage();
    this.settings = this.localStorageService.getSettingsOnLocalStorage() || {
      isOAuthEnabled: true,
      isAuthenticated: this.token && this.token.access_token.length > 0,
      url: "smith-nephew.atlassian.net",
      instanceAuthorized: this.token ? this.token.resources : [],
      instanceSelected:
        this.token && this.token.resources.length > 0
          ? this.token.resources[0].id
          : ""
    };

    if (this.token || !this.settings.isOAuthEnabled) {
      this.profileService
        .getProfile()
        .pipe(map(response => response))
        .subscribe(data => {
          this.profile = data;
        });
    }
  }

  logout() {
    this.localStorageService.clearAuthenticationToken();
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
    for (var i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  openSettingsDialog() {
    const dialogRef = this.dialog.open(MenuSettingsDialog, {
      width: "600px",
      data: this.settings
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.localStorageService.storeSettingsOnLocalStorage(data);
        location.reload();
        //console.log("The dialog was closed: ", result);
      }
    });
  }
}
@Component({
  selector: "menu-settings-dialog",
  templateUrl: "menu-settings.dialog.html"
})
export class MenuSettingsDialog {
  constructor(
    public dialogRef: MatDialogRef<MenuSettingsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: MenuSettingsDialogData
  ) {}
  cancelClick(): void {
    this.dialogRef.close();
  }
}
