import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { AppService } from "./app.service";

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class ActivitiesService {
  constructor(private http: HttpClient, private appService: AppService) {}

  private apiUrl = `${environment.apiUrl}/api`;

  public getActivities(): Observable<any> {
    const url: string = `${this.apiUrl}/activities`;
    const httpProperties = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.appService.getToken()}`
      })
    };

    return this.http.get(url, httpProperties);
  }

  public getActivitiesByTag(tag: string): Observable<any> {
    const url: string = `${this.apiUrl}/activities?tag=${tag}`;
    const httpProperties = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.appService.getToken()}`
      })
    };

    return this.http.get(url, httpProperties);
  }

  public getActivity(activityId: string): Observable<any> {
    const url: string = `${this.apiUrl}/activities/${activityId}`;
    const httpProperties = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.appService.getToken()}`
      })
    };

    return this.http.get(url, httpProperties);
  }

  public createActivity(activityData: any): Observable<any> {
    const url: string = `${this.apiUrl}/activities`;
    const httpProperties = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.appService.getToken()}`
      })
    };

    return this.http.post(url, activityData, httpProperties);
  }

  public updateActivity(activityId: string, activityData: any): Observable<any> {
    const url: string = `${this.apiUrl}/activities/${activityId}`;
    const httpProperties = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.appService.getToken()}`
      })
    };

    return this.http.put(url, activityData, httpProperties);
  }

  public deleteActivity(activityId: string): Observable<any> {
    const url: string = `${this.apiUrl}/activities/${activityId}`;
    const httpProperties = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.appService.getToken()}`
      })
    };

    return this.http.delete(url, httpProperties);
  }
}
