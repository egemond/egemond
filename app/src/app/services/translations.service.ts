import { Injectable } from "@angular/core";

import { AppService } from "./app.service";

import { Language } from "../models/language";

import { environment } from "../../environments/environment";

import en from "../../i18n/en.json";
import sl from "../../i18n/sl.json";

@Injectable({
  providedIn: "root",
})
export class TranslationsService {
  constructor(private appService: AppService) {
    this.translations = {
      en: en,
      sl: sl,
    };

    if (!environment.production) {
      let languages = this.appService.getLanguages();

      languages.forEach((language: Language) => {
        if (!this.translations.hasOwnProperty(language._id)) {
          console.warn(`Translations for language ${language._id} (${language.language}) are not defined.`);
        }
      });
    }
  }

  private translations: any = {};

  private getTranslation(language: string, key: string): string {
    if (language in this.translations && key in this.translations[language]) {
      return this.translations[language][key];
    }
    return key;
  }

  public translate(language: string, key: string): string {
    return this.getTranslation(language, key);
  }
}
