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

  public step: 'SignIn' | 'AuthenticationCode' | 'RecoveryCode' = 'SignIn';

  public user = {
    email: "",
    password: "",
  };

  public authenticationCode: string;

  public recoveryCode: string;

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

    this.authenticationService.signIn(this.user).subscribe({
      next: ((result) => {
        this.appService.signIn(result.token, result.language, result.currency);
        this.router.navigateByUrl("/activities");
      }),
      error: ((error) => {
        error = this.appService.getErrorMessage(error);

        if (error === "Two-factor authentication is required.") {
          this.step = 'AuthenticationCode';

          this.submitted = false;

          this.error.type = undefined;
          this.error.message = undefined;
        } else {
          this.error.type = "danger";
          this.error.message = error;
        }
      })
    }).add(() => {
      this.signingIn = false;
    });
  }

  public verify2FA() {
    this.submitted = true;

    if (!this.authenticationCode) return;

    this.signingIn = true;

    this.authenticationService.verify2FA(this.user, this.authenticationCode).subscribe({
      next: ((result) => {
        this.appService.signIn(result.token, result.language, result.currency);
        this.router.navigateByUrl("/activities");
      }),
      error: ((error) => {
        this.error.type = "danger";
        this.error.message = this.appService.getErrorMessage(error);
      }),
    }).add(() => {
      this.signingIn = false;
    });
  }

  public verifyRecoveryCode() {
    this.submitted = true;

    if (!this.recoveryCode) return;

    this.signingIn = true;

    this.authenticationService.verifyRecoveryCode(this.user, this.recoveryCode).subscribe({
      next: ((result) => {
        this.appService.signIn(result.token, result.language, result.currency);
        this.router.navigateByUrl("/activities");
      }),
      error: ((error) => {
        this.error.type = "danger";
        this.error.message = this.appService.getErrorMessage(error);
      }),
    }).add(() => {
      this.signingIn = false;
    });
  }

  public changeStep(step: 'SignIn' | 'AuthenticationCode' | 'RecoveryCode') {
    this.step = step;

    this.authenticationCode = '';
    this.recoveryCode = '';

    this.submitted = false;

    this.error.type = undefined;
    this.error.message = undefined;
  }

  ngOnInit(): void {
    if (this.appService.getCurrentUser() != null) {
      this.router.navigateByUrl("/activities");
    }
  }
}
