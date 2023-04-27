import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";

import { AppService } from "./app.service";

import { Activity } from "../models/activity";

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class ActivitiesService {
  constructor(private http: HttpClient, private appService: AppService) {}

  private apiUrl = `${environment.apiUrl}/api`;

  public getActivities(): Promise<Activity[]> {
    const url: string = `${this.apiUrl}/activities`;
    const httpProperties = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.appService.getToken()}`
      })
    };

    return this.http
      .get(url, httpProperties)
      .toPromise()
      .then(response => response as Activity[])
      .catch(this.errorHandler);
  }

  public getActivitiesByTag(tag: string): Promise<any> {
    const url: string = `${this.apiUrl}/activities?tag=${tag}`;
    const httpProperties = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.appService.getToken()}`
      })
    };

    return this.http
      .get(url, httpProperties)
      .toPromise()
      .then(response => response as Activity[])
      .catch(this.errorHandler);
  }

  public getActivity(activityId: string): Promise<Activity> {
    const url: string = `${this.apiUrl}/activities/${activityId}`;
    const httpProperties = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.appService.getToken()}`
      })
    };

    return this.http
      .get(url, httpProperties)
      .toPromise()
      .then(response => response as Activity)
      .catch(this.errorHandler);
  }

  public createActivity(activityData: any): Promise<Activity> {
    const url: string = `${this.apiUrl}/activities`;
    const httpProperties = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.appService.getToken()}`
      })
    };

    return this.http
      .post(url, activityData, httpProperties)
      .toPromise()
      .then(response => response as Activity)
      .catch(this.errorHandler);
  }

  public updateActivity(
    activityId: string,
    activityData: any
  ): Promise<Activity> {
    const url: string = `${this.apiUrl}/activities/${activityId}`;
    const httpProperties = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.appService.getToken()}`
      })
    };

    return this.http
      .put(url, activityData, httpProperties)
      .toPromise()
      .then(response => response as Activity)
      .catch(this.errorHandler);
  }

  public deleteActivity(activityId: string): Promise<null> {
    const url: string = `${this.apiUrl}/activities/${activityId}`;
    const httpProperties = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.appService.getToken()}`
      })
    };

    return this.http
      .delete(url, httpProperties)
      .toPromise()
      .then()
      .catch(this.errorHandler);
  }

  private errorHandler(error: any): Promise<any> {
    if (error.name === "HttpErrorResponse") {
      error.message = "The data could not be retrieved.";
    }

    return Promise.reject(error.error.message || "The data could not be retrieved.");
  }
}
