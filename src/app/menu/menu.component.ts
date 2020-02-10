import { Component, OnInit } from "@angular/core";
import { ProfileService } from "../shared/profile/profile.service";
import { map } from "rxjs/internal/operators/map";
import { Profile } from "../models/profile.model";
import { Url } from "url";
import { LocalStorageService } from "../shared";
import { Router } from "@angular/router";

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
    this.profileService
      .getProfile()
      .pipe(map(response => response))
      .subscribe(data => {
        this.profile = data;
        console.log(data.emailAddress);
      });
  }

  logout() {
    this.localStorageService.clearToken();
    this.profile = null;
    this.router.navigate(["/", "home"]);
  }
}
