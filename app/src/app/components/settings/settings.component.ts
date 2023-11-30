import { Component, OnInit, ElementRef } from "@angular/core";
import { Router } from "@angular/router";

import { AppService } from "../../services/app.service";
import { UsersService } from "../../services/users.service";
import { AuthenticationService } from "src/app/services/authentication.service";

import { User } from "../../models/user";
import { Language } from "../../models/language";

@Component({
  selector: "app-account",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"],
})
export class SettingsComponent implements OnInit {
  constructor(private el: ElementRef, public router: Router, private appService: AppService, private usersService: UsersService, private authenticationService: AuthenticationService) {}

  public user: User;
  public languages: Language[];

  public loading: boolean = false;

  public retrievalError: string;

  public getUser() {
    this.loading = true;

    let user = this.appService.getCurrentUser();
    this.usersService.getUser(user._id).subscribe({
      next: ((user) => {
        this.user = user;

        for (var i = 0; i < this.languages.length; i++) {
          if (this.languages[i]._id == this.user.language) {
            this.languages[i]["active"] = true;
          } else {
            this.languages[i]["active"] = false;
          }
        }

        this.appService.setLanguage(user.language);
        this.appService.setTheme(user.theme);

        this.loading = false;
      }),
      error: ((error) => {
        this.retrievalError = this.appService.getErrorMessage(error);
      }),
    });
  }

  ngOnInit(): void {
    this.languages = this.appService.getLanguages();
    this.getUser();
  }
}
