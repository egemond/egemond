import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { Category } from "../models/category";

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class CategoriesService {
  constructor(private http: HttpClient) {}

  private apiUrl = `${environment.apiUrl}/api`;

  public getCategories(): Observable<Category[]> {
    const url: string = `${this.apiUrl}/categories`;
    return this.http.get(url) as Observable<Category[]>;
  }
}
