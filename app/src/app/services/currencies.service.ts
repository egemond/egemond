import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { Currency } from "../models/currency";

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class CurrenciesService {
  constructor(private http: HttpClient) {}

  private apiUrl = `${environment.apiUrl}/api`;

  public getCurrencies(): Observable<Currency[]> {
    const url: string = `${this.apiUrl}/currencies`;
    return this.http.get(url) as Observable<Currency[]>;
  }

  public getCurrency(currencyId): Observable<Currency> {
    const url: string = `${this.apiUrl}/currencies/${currencyId}`;
    return this.http.get(url) as Observable<Currency>;
  }
}
