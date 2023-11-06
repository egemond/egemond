import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from "@angular/core";
import { FormGroup } from "@angular/forms";

import { AppService } from "../../services/app.service";
import { CategoriesService } from "../../services/categories.service";
import { CurrenciesService } from "../../services/currencies.service";

import { Category } from "../../models/category";
import { Currency } from "../../models/currency";

import { LocalizePipe } from "../../pipes/localize.pipe";

@Component({
  selector: "app-activity-form",
  templateUrl: "./activity-form.component.html",
  styleUrls: ["./activity-form.component.css"]
})
export class ActivityFormComponent implements OnInit, OnChanges {
  constructor(private appService: AppService, private categoriesService: CategoriesService, private currenciesService: CurrenciesService, private localizePipe: LocalizePipe) {
    let today = new Date();
    for (var i = 2000; i <= today.getFullYear(); i++) {
      this.years.push(i.toString());
    }
  }

  @Input() public activity: FormGroup;

  public categories: Category[];
  public currency: Currency;
  public years: string[] = [];

  @Input() public alert: {
    variant: string,
    message: string,
  };

  public saving = false;

  public retrievalError: string;

  @Output() loaded = new EventEmitter<void>();
  @Output() saveActivity = new EventEmitter<any>();

  public switch(type: "income" | "expense"): void {
    this.activity.patchValue({
      type: type,
    });

    if ((this.activity.value.type === "expense" && this.activity.value.amount > 0) || (this.activity.value.type === "income" && this.activity.value.amount < 0)) {
      this.activity.patchValue({
        amount: -this.activity.value.amount,
      });
    }
  }

  private getCategories() {
    this.categoriesService.getCategories().subscribe({
      next: ((categories) => {
        this.categories = categories.sort((x, y) => {
          let titleX = this.localizePipe.transform(x.title);
          let titleY = this.localizePipe.transform(y.title);
          
          if (titleX < titleY) {
            return -1;
          } else if (titleX > titleY) {
            return 1;
          } else {
            return 0;
          }
        });
      }),
      error: ((error) => {
        this.retrievalError = this.appService.getErrorMessage(error);
      }),
    }).add(() => {
      this.isLoaded();
    });
  }

  private getCurrency() {
    let currencyId = this.appService.getCurrency();
    this.currenciesService.getCurrency(currencyId).subscribe({
      next: ((currency) => {
        this.currency = currency;
      }),
      error: ((error) => {
        this.retrievalError = this.appService.getErrorMessage(error);
      }),
    }).add(() => {
      this.isLoaded();
    });
  }

  public formatAmount() {
    if (this.activity.value.amount) {
      let amount = this.activity.value.amount.toString().replace(/[^\d.-]/g, "");

      if (this.activity.value.type === "expense" && amount.charAt(0) != "-") {
        amount = `-${amount}`;
      }

      this.activity.patchValue({
        amount: parseFloat(amount),
      });
    }
  }

  public formatTags() {
    let tags = this.activity.value.tags.split(" ");
    tags.forEach((tag, i) => {
      if (tag && tag.charAt(0) != "#") {
        tags[i] = `#${tag}`;
      }
    });

    this.activity.patchValue({
      tags: tags.join(" "),
    });
  }

  public validate(): void {
    if (this.activity.invalid) {
      this.activity.markAllAsTouched();
      return;
    }

    let formattedTags = this.activity.value.tags.trim();
    formattedTags = formattedTags.replace(/#/g, "");
    formattedTags = formattedTags.replace(/\s+/g, " ");

    let tags = formattedTags.length > 0 ? formattedTags.split(" ") : [];

    this.saving = true;

    this.saveActivity.emit({
      title: this.activity.value.title,
      category: this.activity.value.category,
      currency: this.currency._id,
      amount: this.activity.value.amount,
      date: `${this.activity.value.year}-${this.activity.value.month}-${this.activity.value.day}`,
      tags: tags,
      description: this.activity.value.description,
      isExcluded: this.activity.value.isExcluded,
    });

    return;
  }

  private isLoaded(): void {
    if (this.categories && this.currency) {
      this.loaded.emit();
    }
  }

  ngOnInit(): void {
    this.getCategories();
    this.getCurrency();
  }

  ngOnChanges(): void {
    if (!this.activity.value.type) {
      this.activity.value.type = "expense";
    }

    this.formatTags();
  }
}
