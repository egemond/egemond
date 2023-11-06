import { Inject, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { AppService } from "./app.service";

import { AuthenticationResult, TwoFactorAuthenticationConfigurationResult } from "../models/authentication";

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  constructor(private http: HttpClient, private appService: AppService) {}

  private apiUrl = `${environment.apiUrl}/api`;

  public signIn(user: any): Observable<AuthenticationResult> {
    const url: string = `${this.apiUrl}/auth/signin`;

    return this.http.post(url, user) as Observable<AuthenticationResult>;
  }

  public signUp(user: any): Observable<AuthenticationResult> {
    const url: string = `${this.apiUrl}/auth/signup`;

    return this.http.post(url, user) as Observable<AuthenticationResult>;
  }

  public signUpAttempt(user: any): Observable<null> {
    const url: string = `${this.apiUrl}/auth/signup/attempt`;

    return this.http.post(url, user) as Observable<null>;
  }

  public configure2FA(): Observable<TwoFactorAuthenticationConfigurationResult> {
    const url: string = `${this.apiUrl}/auth/2fa/configure`;
    const httpProperties = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.appService.getToken()}`
      })
    };

    return this.http.get(url, httpProperties) as Observable<TwoFactorAuthenticationConfigurationResult>;
  }

  public remove2FA(): Observable<null> {
    const url: string = `${this.apiUrl}/auth/2fa/remove`;
    const httpProperties = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.appService.getToken()}`
      })
    };

    return this.http.delete(url, httpProperties) as Observable<null>;
  }

  public activate2FA(authenticationCode: string): Observable<string[]> {
    const url: string = `${this.apiUrl}/auth/2fa/activate`;
    const httpProperties = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.appService.getToken()}`
      })
    };

    return this.http.post(url, {
        token: authenticationCode,
      }, httpProperties) as Observable<string[]>;
  }

  public verify2FA(user: any, authenticationCode: string): Observable<AuthenticationResult> {
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
      }, httpProperties) as Observable<AuthenticationResult>;
  }

  public verifyRecoveryCode(user: any, recoveryCode: string): Observable<AuthenticationResult> {
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
      }, httpProperties) as Observable<AuthenticationResult>;
  }
}
