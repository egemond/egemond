import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { AppService } from "./app.service";

import { environment } from "../../environments/environment";
import { User } from "../models/user";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  constructor(private http: HttpClient, private appService: AppService) {}

  private apiUrl = `${environment.apiUrl}/api`;

  public getUser(userId: string): Observable<User> {
    const url: string = `${this.apiUrl}/users/${userId}`;
    const httpProperties = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.appService.getToken()}`,
      }),
    };

    return this.http.get(url, httpProperties) as Observable<User>;
  }

  public updateUser(user: any): Observable<User> {
    const url: string = `${this.apiUrl}/users/${user._id}`;
    const httpProperties = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.appService.getToken()}`,
      }),
    };

    return this.http.put(url, user, httpProperties) as Observable<User>;
  }

  public deleteUser(userId: string): Observable<null> {
    const url: string = `${this.apiUrl}/users/${userId}`;
    const httpProperties = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.appService.getToken()}`,
      }),
    };

    return this.http.delete(url, httpProperties) as Observable<null>;
  }
}
