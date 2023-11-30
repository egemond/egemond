import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { Subject } from "rxjs";
import { FormBuilder, Validators } from "@angular/forms";

import { ActivitiesService } from "../../services/activities.service";
import { AppService } from "src/app/services/app.service";

import { Activity } from "../../models/activity";

@Component({
  selector: "app-activity-edit",
  templateUrl: "./activity-edit.component.html",
  styleUrls: ["./activity-edit.component.css"],
})
export class ActivityEditComponent implements OnInit {
  constructor(private router: Router, private path: ActivatedRoute, private activitiesService: ActivitiesService, private appService: AppService) {}

  public retrievalError: string;

  public activityId: string;

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

  public updateActivity(activity: any): void {
    this.activitiesService
      .updateActivity(this.activityId, activity)
      .subscribe({
        next: ((activity) => {
          this.router.navigateByUrl("/activity/" + this.activityId);
        }),
        error: ((error) => {
          this.alert = {
            variant: "danger",
            message: this.appService.getErrorMessage(error),
          };
        }),
      });
  }

  ngOnInit(): void {
    this.path.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          let activityId = params.get("activityId");
          return this.activitiesService.getActivity(activityId);
        })
      )
      .subscribe({
        next: ((activity: Activity) => {
          this.activityId = activity._id;

          let date = new Date(activity.date);
          this.activity.patchValue({
            title: activity.title,
            category: activity.category._id,
            amount: activity.amount,
            type: activity.amount < 0 ? "expense" : "income",
            day: `0${date.getDate()}`.slice(-2),
            month: `0${date.getMonth() + 1}`.slice(-2),
            year: date.getFullYear().toString(),
            tags: activity.tags.join(" "),
            description: activity.description,
            isExcluded: activity.isExcluded,
          });
        }),
        error: ((error) => {
          this.retrievalError = this.appService.getErrorMessage(error);
        }),
      });
  }
}
