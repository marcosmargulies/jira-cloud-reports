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
    if (this.localStorageService.getTokenOnLocalStorage() != null) {
      return true;
    }

    this.router.navigate(["/home"]);
    return false;
  }
}
