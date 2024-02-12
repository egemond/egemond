import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, Validators } from "@angular/forms";

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
    let today = new Date();

    this.activity.patchValue({
      day: `0${today.getDate()}`.slice(-2),
      month: `0${today.getMonth() + 1}`.slice(-2),
      year: today.getFullYear().toString(),
    });
  }

  private formBuilder = new FormBuilder();
  public activity = this.formBuilder.group({
    title: ["", Validators.required],
    category: ["", Validators.required],
    amount: [<undefined | number>undefined, Validators.required],
    type: [<"income" | "expense">"expense", Validators.required],
    day: [<undefined | String>undefined, Validators.required],
    month: [<undefined | String>undefined, Validators.required],
    year: [<undefined | String>undefined, Validators.required],
    tags: [""],
    description: [""],
    isExcluded: [false, Validators.required],
  });

  public alert: {
    variant: string,
    message: string,
  };

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
          this.alert = {
            variant: "danger",
            message: this.appService.getErrorMessage(error),
          };
        }),
      });
  }
}
