import { Component, EventEmitter, Input, Output } from "@angular/core";

import { AppService } from "src/app/services/app.service";
import { UsersService } from "src/app/services/users.service";

import { User } from "src/app/models/user";

@Component({
  selector: "app-settings-update-account",
  templateUrl: "./settings-update-account.component.html",
  styleUrls: ["./settings-update-account.component.css"]
})
export class SettingsUpdateAccountComponent {
  constructor(private appService: AppService, private usersService: UsersService) {
  }

  @Input() public user: User;

  public submitted: boolean = false;
  public saving: boolean = false;

  public alert: {
    variant: string,
    message: string,
  };

  public updateAccount() {
    this.submitted = true;

    if (!this.user.email) return;

    this.user.password = undefined;

    this.updateUser();
  }

  public updateUser() {
    this.saving = true;

    return this.usersService.updateUser(this.user).subscribe({
      next: ((user) => {
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
