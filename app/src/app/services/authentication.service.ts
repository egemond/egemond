import { Inject, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { AppService } from "./app.service";

import { AuthenticationResult } from "../models/authentication-result";

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  constructor(private http: HttpClient, private appService: AppService) {}

  private apiUrl = `${environment.apiUrl}/api`;

  public signIn(user: any): Observable<any> {
    const url: string = `${this.apiUrl}/auth/signin`;

    return this.http.post(url, user);
  }

  public signUp(user: any): Observable<any> {
    const url: string = `${this.apiUrl}/auth/signup`;

    return this.http.post(url, user);
  }

  public signUpAttempt(user: any): Observable<any> {
    const url: string = `${this.apiUrl}/auth/signup/attempt`;

    return this.http.post(url, user);
  }

  public configure2FA(): Observable<any> {
    const url: string = `${this.apiUrl}/auth/2fa/configure`;
    const httpProperties = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.appService.getToken()}`
      })
    };

    return this.http.get(url, httpProperties);
  }

  public remove2FA(): Observable<any> {
    const url: string = `${this.apiUrl}/auth/2fa/remove`;
    const httpProperties = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.appService.getToken()}`
      })
    };

    return this.http.delete(url, httpProperties);
  }

  public activate2FA(authenticationCode: string): Observable<any> {
    const url: string = `${this.apiUrl}/auth/2fa/activate`;
    const httpProperties = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.appService.getToken()}`
      })
    };

    return this.http.post(url, {
        token: authenticationCode,
      }, httpProperties);
  }

  public verify2FA(user: any, authenticationCode: string): Observable<any> {
    const url: string = `${this.apiUrl}/auth/2fa/verify`;
    const httpProperties = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.appService.getToken()}`
      })
    };

    return this.http.post(url, {
        email: user.email,
        password: user.password,
        token: authenticationCode,
      }, httpProperties);
  }

  public verifyRecoveryCode(user: any, recoveryCode: string): Observable<any> {
    const url: string = `${this.apiUrl}/auth/2fa/recovery/verify`;
    const httpProperties = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.appService.getToken()}`
      })
    };

    return this.http
      .post(url, {
        email: user.email,
        password: user.password,
        recoveryCode: recoveryCode,
      }, httpProperties);
  }
}
