import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";

import { AppService } from "./app.service";

@Injectable({
  providedIn: "root",
})
export class AuthenticationGuardService implements CanActivate {
  constructor(public router: Router, public appService: AppService) {}

  canActivate(): boolean {
    if (!this.appService.getCurrentUser()) {
      this.router.navigateByUrl("/signin");
      return false;
    }
    return true;
  }
}
