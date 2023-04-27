import { Pipe, PipeTransform } from "@angular/core";

import { AppService } from "../services/app.service";
import { TranslationsService } from "../services/translations.service";

@Pipe({
  name: "localize",
  pure: false,
})
export class LocalizePipe implements PipeTransform {
  constructor(private appService: AppService, private translationsService: TranslationsService) {}

  transform(value: string): string {
    let language = this.appService.getLanguage();
    return this.translationsService.translate(language, value);
  }
}
