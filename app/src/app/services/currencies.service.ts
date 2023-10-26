import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class CurrenciesService {
  constructor(private http: HttpClient) {}

  private apiUrl = `${environment.apiUrl}/api`;

  public getCurrencies(): Observable<any> {
    const url: string = `${this.apiUrl}/currencies`;
    return this.http.get(url);
  }

  public getCurrency(currencyId): Observable<any> {
    const url: string = `${this.apiUrl}/currencies/${currencyId}`;
    return this.http.get(url);
  }
}
