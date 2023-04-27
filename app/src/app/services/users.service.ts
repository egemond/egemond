import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { AppService } from "./app.service";

import { User } from "../models/user";

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  constructor(private http: HttpClient, private appService: AppService) {}

  private apiUrl = `${environment.apiUrl}/api`;

  public getUser(userId: string): Promise<User> {
    const url: string = `${this.apiUrl}/users/${userId}`;
    const httpProperties = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.appService.getToken()}`,
      }),
    };

    return this.http
      .get(url, httpProperties)
      .toPromise()
      .then((response) => response as User)
      .catch(this.errorHandler);
  }

  public updateUser(user: any): Promise<User> {
    const url: string = `${this.apiUrl}/users/${user._id}`;
    const httpProperties = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.appService.getToken()}`,
      }),
    };

    return this.http
      .put(url, user, httpProperties)
      .toPromise()
      .then((response) => response as User)
      .catch(this.errorHandler);
  }

  public deleteUser(userId: string): Promise<null> {
    const url: string = `${this.apiUrl}/users/${userId}`;
    const httpProperties = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.appService.getToken()}`,
      }),
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
