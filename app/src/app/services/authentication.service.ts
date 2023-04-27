import { Inject, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { AppService } from "./app.service";

import { AuthenticationResult } from "../models/authentication-result";

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  constructor(private http: HttpClient, private appService: AppService) {}

  private apiUrl = `${environment.apiUrl}/api`;

  public signIn(user: any): Promise<any> {
    const url: string = `${this.apiUrl}/auth/signin`;
    return this.http
      .post(url, user)
      .toPromise()
      .then((result: AuthenticationResult) => {
        this.appService.signIn(result.token, result.language, result.currency);
        return result as AuthenticationResult;
      })
      .catch(this.errorHandler);
  }

  public signUp(user: any): Promise<any> {
    const url: string = `${this.apiUrl}/auth/signup`;
    return this.http
      .post(url, user)
      .toPromise()
      .then((result: AuthenticationResult) => {
        this.appService.signIn(result.token, result.language, result.currency);
        return result as AuthenticationResult;
      })
      .catch(this.errorHandler);
  }

  public signUpAttempt(user: any): Promise<any> {
    const url: string = `${this.apiUrl}/auth/signup/attempt`;
    return this.http
      .post(url, user)
      .toPromise()
      .then(() => {
        return;
      })
      .catch(this.errorHandler);
  }

  private errorHandler(error: any): Promise<any> {
    if (error.name === "HttpErrorResponse") {
      error.message = "The data could not be retrieved.";
    }

    return Promise.reject(error.error.message || "The data could not be retrieved.");
  }
}
