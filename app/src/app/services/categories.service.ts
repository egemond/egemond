import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Category } from "../models/category";

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class CategoriesService {
  constructor(private http: HttpClient) {}

  private apiUrl = `${environment.apiUrl}/api`;

  public getCategories(): Promise<Category[]> {
    const url: string = `${this.apiUrl}/categories`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => response as Category[])
      .catch(this.errorHandler);
  }

  private errorHandler(error: any): Promise<any> {
    if (error.name === "HttpErrorResponse") {
      error.message = "The data could not be retrieved.";
    }

    return Promise.reject(error.message || "The data could not be retrieved.");
  }
}
