import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AppService } from "../../services/app.service";
import { AuthenticationService } from "../../services/authentication.service";

@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.css"],
})
export class SigninComponent implements OnInit {
  constructor(private router: Router, private appService: AppService, private authenticationService: AuthenticationService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  public user = {
    email: "",
    password: "",
  };

  public submitted = false;

  public signingIn = false;

  public error = {
    type: "",
    message: "",
  };

  public signIn() {
    this.submitted = true;

    if (!this.user.email) return;

    if (!this.user.password) return;

    this.signingIn = true;

    this.authenticationService
      .signIn(this.user)
      .then(() => {
        this.router.navigateByUrl("/activities");
      })
      .catch((error) => {
        this.error.type = "danger";
        this.error.message = error;
      })
      .finally(() => {
        this.signingIn = false;
      });
  }

  ngOnInit(): void {
    if (this.appService.getCurrentUser() != null) {
      this.router.navigateByUrl("/activities");
    }
  }
}
