import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Currency } from "../models/currency";

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class CurrenciesService {
  constructor(private http: HttpClient) {}

  private apiUrl = `${environment.apiUrl}/api`;

  public getCurrencies(): Promise<Currency[]> {
    const url: string = `${this.apiUrl}/currencies`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => response as Currency[])
      .catch(this.errorHandler);
  }

  public getCurrency(currencyId): Promise<Currency> {
    const url: string = `${this.apiUrl}/currencies/${currencyId}`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => response as Currency)
      .catch(this.errorHandler);
  }

  private errorHandler(error: any): Promise<any> {
    if (error.name === "HttpErrorResponse") {
      error.message = "The data could not be retrieved.";
    }

    return Promise.reject(error.message || "The data could not be retrieved.");
  }
}
