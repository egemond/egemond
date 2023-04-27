import { Component, OnInit, ElementRef } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";

import { AppService } from "../../services/app.service";
import { UsersService } from "../../services/users.service";

import { User } from "../../models/user";
import { Language } from "../../models/language";

@Component({
  selector: "app-account",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"],
})
export class SettingsComponent implements OnInit {
  constructor(private el: ElementRef, public router: Router, private appService: AppService, private usersService: UsersService) {}

  public user: User;

  public languages: Language[];

  public submitted = false;

  public saving = false;

  public deleteAccountConfirmed = false;

  public error = {
    type: "",
    message: "",
  };

  public retrievalError: string;

  public changeTab() {
    this.error.type = "";
    this.error.message = "";
  }

  public changeLanguage(language) {
    if (this.user.language == language) return;

    this.user.language = language;

    for (var i = 0; i < this.languages.length; i++) {
      if (this.languages[i]._id == this.user.language) {
        this.languages[i]["active"] = true;
      } else {
        this.languages[i]["active"] = false;
      }
    }

    this.updateUser();
  }

  public updateAccount() {
    this.submitted = true;

    if (!this.user.email) return;

    if (!this.user.password) return;

    this.updateUser();
  }

  private updateUser() {
    this.saving = true;

    return this.usersService
      .updateUser(this.user)
      .then((user) => {
        this.submitted = false;

        this.user = user;
        this.appService.setLanguage(user.language);

        this.error.type = "success";
        this.error.message = "Settings successfully saved.";
      })
      .catch((error) => {
        this.error.type = "danger";
        this.error.message = error;
      })
      .finally(() => {
        this.saving = false;
      });
  }

  public deleteUser() {
    if (!this.deleteAccountConfirmed) return;

    this.saving = true;

    return this.usersService
      .deleteUser(this.user._id)
      .then(() => {
        this.appService.signOut();
        this.router.navigateByUrl("/signin");
      })
      .catch((error) => {
        this.saving = false;

        this.error.type = "danger";
        this.error.message = error;
      });
  }

  ngOnInit(): void {
    this.languages = this.appService.getLanguages();

    let user = this.appService.getCurrentUser();
    this.usersService.getUser(user._id).then((user) => {
      this.user = user;

      for (var i = 0; i < this.languages.length; i++) {
        if (this.languages[i]._id == this.user.language) {
          this.languages[i]["active"] = true;
        } else {
          this.languages[i]["active"] = false;
        }
      }
    })
    .catch((error) => {
      this.retrievalError = error;
    });
  }
}
