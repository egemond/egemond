import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { AppService } from "./app.service";

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  constructor(private http: HttpClient, private appService: AppService) {}

  private apiUrl = `${environment.apiUrl}/api`;

  public getUser(userId: string): Observable<any> {
    const url: string = `${this.apiUrl}/users/${userId}`;
    const httpProperties = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.appService.getToken()}`,
      }),
    };

    return this.http.get(url, httpProperties);
  }

  public updateUser(user: any): Observable<any> {
    const url: string = `${this.apiUrl}/users/${user._id}`;
    const httpProperties = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.appService.getToken()}`,
      }),
    };

    return this.http.put(url, user, httpProperties);
  }

  public deleteUser(userId: string): Observable<any> {
    const url: string = `${this.apiUrl}/users/${userId}`;
    const httpProperties = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.appService.getToken()}`,
      }),
    };

    return this.http.delete(url, httpProperties);
  }
}
