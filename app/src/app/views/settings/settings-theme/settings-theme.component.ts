import { Component, EventEmitter, Input, Output } from "@angular/core";

import { User } from "../../../models/user";
import { AppService } from "src/app/services/app.service";
import { UsersService } from "src/app/services/users.service";

@Component({
  selector: "app-settings-theme",
  templateUrl: "./settings-theme.component.html",
  styleUrls: ["./settings-theme.component.css"]
})
export class SettingsThemeComponent {
  constructor(private appService: AppService, private usersService: UsersService) {
  }

  @Input() public user: User;

  public saving: boolean;
  
  public alert: {
    variant: string,
    message: string,
  };

  public changeTheme(theme: "light" | "dark") {
    if (this.user.theme == theme) return;

    this.user.theme = theme;
    
    this.updateUser();
  }

  public updateUser() {
    this.saving = true;

    return this.usersService.updateUser(this.user).subscribe({
      next: ((user) => {
        this.appService.setLanguage(user.language);
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
