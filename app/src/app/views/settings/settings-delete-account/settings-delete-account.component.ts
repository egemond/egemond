import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";

import { AppService } from "src/app/services/app.service";
import { UsersService } from "src/app/services/users.service";

import { User } from "src/app/models/user";

@Component({
  selector: "app-settings-delete-account",
  templateUrl: "./settings-delete-account.component.html",
  styleUrls: ["./settings-delete-account.component.css"]
})
export class SettingsDeleteAccountComponent {
  constructor(private router: Router, private appService: AppService, private usersService: UsersService) {
  }

  @Input() public user: User;

  public deleteAccountConfirmed: boolean = false;

  public saving: boolean = false;

  public alert: {
    variant: string,
    message: string,
  };

  public deleteUser() {
    if (!this.deleteAccountConfirmed) return;

    this.saving = true;

    return this.usersService.deleteUser(this.user._id).subscribe({
      next: (() => {
        this.appService.signOut();
        this.router.navigateByUrl("/signin");
      }),
      error: ((error) => {
        this.saving = false;

        this.alert = {
          variant: "danger",
          message: this.appService.getErrorMessage(error),
        };
      }),
    });
  }
}
