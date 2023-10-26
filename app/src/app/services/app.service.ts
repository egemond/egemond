import { Inject, Injectable } from "@angular/core";

import { BROWSER_STORAGE } from "../models/storage";
import { Language } from "../models/language";
import { User } from "../models/user";
import { Currency } from "../models/currency";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(@Inject(BROWSER_STORAGE) private storage: Storage) { }

  public signIn(token: string, language: string, currency: string) {
    this.setToken(token);
    this.setLanguage(language);
    this.setCurrency(currency);
  }

  public signOut(): void {
    this.storage.removeItem("token");
  }

  public getCurrentUser(): User {
    const token: string = this.getToken();
    if (token) {
      const content = JSON.parse(this.b64utf8(token.split(".")[1]));
      let user = {
        _id: content._id,
        email: content.email,
      };
      return user;
    } else {
      return null;
    }
  }

  public getToken(): string {
    return this.storage.getItem("token");
  }
  
  public setToken(token: string): void {
    this.storage.setItem("token", token);
  }

  private b64utf8(string: string): string {
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(string), (char: string) => {
          return "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  }

  public getLanguages(): Language[] {
    return [{
      _id: "en",
      language: "English",
    }, {
      _id: "sl",
      language: "Slovenščina",
    }];
  }

  public getLanguage(): string {
    let language = this.storage.getItem("language");
    if (!language) {
      language = "en";
      this.setLanguage(language);
    }
    return language;
  }

  public setLanguage(value: string): void {
    this.storage.setItem("language", value);
  }

  public getCurrency(): string {
    let currency = this.storage.getItem("currency");
    return currency;
  }

  public setCurrency(value: string): void {
    this.storage.setItem("currency", value);
  }

  public getTheme(): string {
    let theme = this.storage.getItem("theme");
    if (!theme) {
      theme = "light";
      this.setTheme(theme);
    }
    return theme;
  }

  public setTheme(value: string): void {
    this.storage.setItem("theme", value);
  }

  public getErrorMessage(error: any): string {
    if (error.name === "HttpErrorResponse") {
      error.message = "The data could not be retrieved.";
    }

    return error.error.message || "The data could not be retrieved.";
  }
}
