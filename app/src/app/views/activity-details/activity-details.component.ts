import { Component, OnInit, LOCALE_ID } from "@angular/core";
import { Router } from "@angular/router";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { DomSanitizer, SafeStyle } from "@angular/platform-browser";
import { switchMap } from "rxjs/operators";

import { ActivitiesService } from "../../services/activities.service";
import { AppService } from "../../services/app.service";

import { Activity } from "../../models/activity";

@Component({
  selector: "app-activity-details",
  templateUrl: "./activity-details.component.html",
  styleUrls: ["./activity-details.component.css"],
  providers: [
    {
      provide: LOCALE_ID,
      useFactory: (appService: AppService) => {
        return appService.getLanguage();
      },
      deps: [AppService],
    }
  ],
})
export class ActivityDetailsComponent implements OnInit {
  constructor(private router: Router, private path: ActivatedRoute, private activitiesService: ActivitiesService, private sanitizer: DomSanitizer) {}

  public activity: Activity;

  public image: SafeStyle;

  public saving = false;

  public error = {
    type: "",
    message: "",
  };

  public retrievalError: string;

  public deleteActivity(): void {
    this.saving = true;

    this.activitiesService
      .deleteActivity(this.activity._id)
      .then((result) => {
        (document.querySelector("#deleteModalButton") as HTMLElement).click();
        this.router.navigateByUrl("/activities");
      })
      .catch((error) => {
        this.error.type = "danger";
        this.error.message = error;
      })
      .finally(() => {
        this.saving = false;
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
          
          if (activity.category && activity.category.image) {
            this.image = this.sanitizer.bypassSecurityTrustStyle(
              `url(${activity.category.image})`
            );
          }
        },
        (error) => {
          this.retrievalError = error;
        }
      );
  }
}
