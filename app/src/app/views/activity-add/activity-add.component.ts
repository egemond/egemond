import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

import { ActivitiesService } from "../../services/activities.service";
import { AppService } from "src/app/services/app.service";

import { LocalizePipe } from "../../pipes/localize.pipe";

@Component({
  selector: "app-activity-add",
  templateUrl: "./activity-add.component.html",
  styleUrls: ["./activity-add.component.css"],
  providers: [
    LocalizePipe,
  ],
})
export class ActivityAddComponent {
  constructor(private router: Router, private activitiesService: ActivitiesService, private appService: AppService) {
    let date = new Date();

    this.activity.day = ("0" + date.getDate().toString()).slice(-2);
    this.activity.month = ("0" + (date.getMonth() + 1).toString()).slice(-2);
    this.activity.year = date.getFullYear().toString();
  }

  public activity = {
    title: "",
    category: "",
    amount: "",
    type: "expense",
    day: "",
    month: "",
    year: "",
    tags: "",
    description: "",
  };

  errorSubject: Subject<any> = new Subject<any>();

  public loading = true;

  public onLoaded(): void {
    this.loading = false;
  }

  public createActivity(activity: any): void {
    this.activitiesService
      .createActivity(activity)
      .subscribe({
        next: ((activity) => {
          this.router.navigateByUrl("/activities");
        }),
        error: ((error) => {
          this.errorSubject.next({
            type: "danger",
            message: this.appService.getErrorMessage(error),
          });
        }),
      });
  }
}
