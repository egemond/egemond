import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AppService } from "../../services/app.service";
import { AuthenticationService } from "../../services/authentication.service";
import { CurrenciesService } from "../../services/currencies.service";

import { Currency } from "src/app/models/currency";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent {
  constructor(private router: Router, private appService: AppService, private authenticationService: AuthenticationService, private currenciesService: CurrenciesService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  public retrievalError: string;

  public user = {
    email: "",
    password: "",
    masterPassword: "",
    currency: "",
    language: "",
  };

  public currencies: Currency[];

  public step: number = 1;

  public submitted = false;

  public signingUp = false;

  public error = {
    type: "",
    message: "",
  };

  public continueToCurrency() {
    this.submitted = true;

    if (!this.user.email) return;

    if (!this.user.password) return;

    this.signingUp = true;

    this.authenticationService.signUpAttempt(this.user).subscribe({
      next: (() => {
        this.currenciesService.getCurrencies().subscribe({
          next: ((currencies) => {
            this.currencies = currencies;
            this.step++;
          }),
          error: ((error) => {
            this.retrievalError = this.appService.getErrorMessage(error);
          }),
        }).add(() => {
          this.signingUp = false;
        });
      }),
      error: ((error) => {
        this.error.type = "danger";
        this.error.message = this.appService.getErrorMessage(error);
      }),
    }).add(() => {
      this.signingUp = false;
    });
  }

  public signUp(currencyId: string) {
    this.user.currency = currencyId;
    this.user.language = this.appService.getLanguage();

    this.signingUp = true;

    this.authenticationService.signUp(this.user).subscribe({
      next: ((result) => {
        this.appService.signIn(result.token, result.language, result.currency);
        this.router.navigateByUrl("/activities");
      }),
      error: ((error) => {
        this.error.type = "danger";
        this.error.message = this.appService.getErrorMessage(error);
      }),
    }).add(() => {
      this.signingUp = false;
    });
  }

  ngOnInit(): void {
    if (this.appService.getCurrentUser() != null) {
      this.router.navigateByUrl("/activities");
    }
  }
}
