import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from "@angular/router";
import { LocalStorageService } from "../local-storage/local.storage.service";

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (
      this.localStorageService.getAuthenticationTokenOnLocalStorage() != null ||
      (this.localStorageService.getSettingsOnLocalStorage() &&
        !this.localStorageService.getSettingsOnLocalStorage().isOAuthEnabled)
    ) {
      return true;
    }

    this.router.navigate(["/home"]);
    return false;
  }
}
