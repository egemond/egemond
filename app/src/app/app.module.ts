import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import en from "@angular/common/locales/en";
registerLocaleData(en);

import sl from "@angular/common/locales/sl";
registerLocaleData(sl);

import { LayoutComponent } from "./components/layout/layout.component";
import { SigninComponent } from "./views/signin/signin.component";
import { SignupComponent } from "./views/signup/signup.component";
import { ActivitiesComponent } from './views/activities/activities.component';
import { ActivityAddComponent } from "./views/activity-add/activity-add.component";
import { ActivityDetailsComponent } from "./views/activity-details/activity-details.component";
import { ActivityEditComponent } from "./views/activity-edit/activity-edit.component";
import { StatisticsComponent } from "./views/statistics/statistics.component";
import { SettingsComponent } from "./views/settings/settings.component";
import { ActivityFormComponent } from "./components/activity-form/activity-form.component";
import { SpinnerComponent } from "./components/spinner/spinner.component";

import { AuthenticationGuardService as AuthenticationGuard } from "./services/authentication-guard.service";

import { LocalizePipe } from "./pipes/localize.pipe";
import { MonthPipe } from "./pipes/month.pipe";

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
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
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
  providers: [LocalizePipe],
  bootstrap: [LayoutComponent]
})
export class AppModule {}
