import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { Subject } from "rxjs";

import { ActivitiesService } from "../../services/activities.service";
import { CategoriesService } from "../../services/categories.service";

import { Activity } from "../../models/activity";

import { LocalizePipe } from "../../pipes/localize.pipe";

@Component({
  selector: "app-activity-edit",
  templateUrl: "./activity-edit.component.html",
  styleUrls: ["./activity-edit.component.css"],
})
export class ActivityEditComponent implements OnInit {
  constructor(private router: Router, private path: ActivatedRoute, private activitiesService: ActivitiesService, private categoriesService: CategoriesService, private localizePipe: LocalizePipe) {}

  public retrievalError: string;

  public activity: any;

  errorSubject: Subject<any> = new Subject<any>();

  public loading = true;

  public onLoaded(): void {
    this.loading = false;
  }

  public updateActivity(activity: any): void {
    this.activitiesService
      .updateActivity(this.activity._id, activity)
      .then((activity) => {
        this.router.navigateByUrl("/activity/" + this.activity._id);
      })
      .catch((error) => {
        this.errorSubject.next({
          type: "danger",
          message: error,
        });
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
      .subscribe(
        (activity: Activity) => {
          this.activity = activity;

          this.activity.type = this.activity.amount < 0 ? "expense" : "income";
          this.activity.amount = Math.abs(this.activity.amount).toString();

          this.activity.category = this.activity.category._id;
          this.activity.date = new Date(this.activity.date);
          this.activity.tags = this.activity.tags.join(" ");

          this.activity.day = ("0" + activity.date.getDate().toString()).slice(-2);
          this.activity.month = ("0" + (activity.date.getMonth() + 1).toString()).slice(-2);
          this.activity.year = activity.date.getFullYear().toString();
        },
        (error) => {
          this.retrievalError = error;
        }
      );
  }
}
