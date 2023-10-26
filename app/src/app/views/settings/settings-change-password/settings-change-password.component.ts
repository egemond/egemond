import { Component, EventEmitter, Input, Output } from "@angular/core";

import { AppService } from "src/app/services/app.service";
import { UsersService } from "src/app/services/users.service";

import { User } from "src/app/models/user";

@Component({
  selector: "app-settings-change-password",
  templateUrl: "./settings-change-password.component.html",
  styleUrls: ["./settings-change-password.component.css"]
})
export class SettingsChangePasswordComponent {
  constructor(private appService: AppService, private usersService: UsersService) {
  }

  @Input() public user: User;

  public password: string;
  public confirmPassword: string;

  public submitted: boolean = false;
  public saving: boolean = false;

  public alert: {
    variant: string,
    message: string,
  };

  public changePassword() {
    this.submitted = true;

    if (!this.password) return;

    if (!this.confirmPassword) return;

    if (this.password !== this.confirmPassword) {
      this.alert = {
        variant: "danger",
        message: "Passwords do not match.",
      };
      return;
    }

    this.user.password = this.password;
    this.updateUser();   
  }

  public updateUser() {
    this.saving = true;

    return this.usersService.updateUser(this.user).subscribe({
      next: ((user) => {
        this.submitted = false;

        this.password = undefined;
        this.confirmPassword = undefined;

        this.appService.setLanguage(user.language);

        document.body.setAttribute("data-bs-theme", user.theme);
        this.appService.setTheme(user.theme);

        this.alert = {
          variant: "success",
          message: "Settings successfully saved.",
        };
      }),
      error: ((error) => {
        this.alert = {
          variant: "danger",
          message: this.appService.getErrorMessage(error),
        };
      }),
    }).add(() => {
      this.saving = false;
    });
  }
}
