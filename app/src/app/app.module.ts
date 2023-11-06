import { BrowserModule } from "@angular/platform-browser";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { registerLocaleData } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { tap } from "rxjs";
import { QRCodeModule } from "angularx-qrcode";

import en from "@angular/common/locales/en";
registerLocaleData(en);

import sl from "@angular/common/locales/sl";
registerLocaleData(sl);

import { AuthenticationGuardService as AuthenticationGuard } from "./services/authentication-guard.service";
import { AppService } from "./services/app.service";
import { UsersService } from "./services/users.service";

import { LocalizePipe } from "./pipes/localize.pipe";
import { MonthPipe } from "./pipes/month.pipe";

import { LayoutComponent } from "./components/layout/layout.component";
import { SigninComponent } from "./views/signin/signin.component";
import { SignupComponent } from "./views/signup/signup.component";
import { ActivitiesComponent } from "./views/activities/activities.component";
import { ActivityAddComponent } from "./views/activity-add/activity-add.component";
import { ActivityDetailsComponent } from "./views/activity-details/activity-details.component";
import { ActivityEditComponent } from "./views/activity-edit/activity-edit.component";
import { StatisticsComponent } from "./views/statistics/statistics.component";
import { SettingsComponent } from "./views/settings/settings.component";
import { ActivityFormComponent } from "./components/activity-form/activity-form.component";
import { SpinnerComponent } from "./components/common/spinner/spinner.component";
import { ButtonSpinnerComponent } from "./components/common/button-spinner/button-spinner.component";
import { SettingsTwoFactorAuthenticationComponent } from "./views/settings/settings-two-factor-authentication/settings-two-factor-authentication.component";
import { SettingsThemeComponent } from "./views/settings/settings-theme/settings-theme.component";
import { SettingsLanguageComponent } from "./views/settings/settings-language/settings-language.component";
import { SettingsChangePasswordComponent } from "./views/settings/settings-change-password/settings-change-password.component";
import { SettingsUpdateAccountComponent } from "./views/settings/settings-update-account/settings-update-account.component";
import { SettingsDeleteAccountComponent } from "./views/settings/settings-delete-account/settings-delete-account.component";

export function initializeAppFactory(appService: AppService, usersService: UsersService) {
  const user = appService.getCurrentUser();
  if (user != null) {
    return () => usersService.getUser(user._id).pipe(tap((user: any) => {
      appService.setLanguage(user.language);
      appService.setCurrency(user.currency);
      appService.setTheme(user.theme);
    }));
  }
  return () => {};
}

@NgModule({
  declarations: [
    LayoutComponent,
    SigninComponent,
    SignupComponent,
    ActivitiesComponent,
    SettingsComponent,
    ActivityDetailsComponent,
    ActivityAddComponent,
    LocalizePipe,
    ActivityEditComponent,
    MonthPipe,
    StatisticsComponent,
    ActivityFormComponent,
    SpinnerComponent,
    SettingsTwoFactorAuthenticationComponent,
    SettingsThemeComponent,
    ButtonSpinnerComponent,
    SettingsLanguageComponent,
    SettingsChangePasswordComponent,
    SettingsUpdateAccountComponent,
    SettingsDeleteAccountComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    QRCodeModule,
    RouterModule.forRoot([
      {
          path: "signin",
          component: SigninComponent,
      },
      {
        path: "signup",
        component: SignupComponent,
      },
      {
        path: "activities",
        component: ActivitiesComponent,
        canActivate: [AuthenticationGuard],
      },
      {
          path: "statistics",
          component: StatisticsComponent,
          canActivate: [AuthenticationGuard],
      },
      {
          path: "settings",
          component: SettingsComponent,
          canActivate: [AuthenticationGuard],
      },
      {
          path: "activity/add",
          component: ActivityAddComponent,
          canActivate: [AuthenticationGuard],
      },
      {
          path: "activity/edit/:activityId",
          component: ActivityEditComponent,
          canActivate: [AuthenticationGuard],
      },
      {
          path: "activity/:activityId",
          component: ActivityDetailsComponent,
          canActivate: [AuthenticationGuard],
      },
      {
          path: "",
          redirectTo: "/activities",
          pathMatch: "full",
      },
    ]),
  ],
  exports: [RouterModule],
  providers: [
    LocalizePipe,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      multi: true,
      deps: [AppService, UsersService],
    },
  ],
  bootstrap: [LayoutComponent]
})
export class AppModule {}
