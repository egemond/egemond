import { Component, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy, SimpleChanges } from "@angular/core";

import { AppService } from "../../services/app.service";
import { CategoriesService } from "../../services/categories.service";
import { CurrenciesService } from "../../services/currencies.service";

import { Category } from "../../models/category";
import { Currency } from "../../models/currency";

import { LocalizePipe } from "../../pipes/localize.pipe";
import { Observable, Subscription } from "rxjs";

@Component({
  selector: "app-activity-form",
  templateUrl: "./activity-form.component.html",
  styleUrls: ["./activity-form.component.css"]
})
export class ActivityFormComponent implements OnInit, OnChanges, OnDestroy {
  constructor(private appService: AppService, private categoriesService: CategoriesService, private currenciesService: CurrenciesService, private localizePipe: LocalizePipe) {
    let date = new Date();

    for (var i = 2000; i <= date.getFullYear(); i++) {
      this.years.push(i);
    }
  }

  @Input() public activity: any = {
    title: "",
    category: "",
    amount: "",
    type: "expense",
    day: "",
    month: "",
    year: "",
    tags: "",
    description: "",
    isExcluded: false,
  };

  private errorSubscription: Subscription;

  @Input() errorEvent: Observable<any>;

  public error: any = {
    type: "",
    message: "",
  };

  @Output() loaded = new EventEmitter<void>();

  @Output() saveActivity = new EventEmitter<any>();

  public categories: Category[];

  public currency: Currency;

  public years = [];

  public submitted = false;

  public saving = false;

  public retrievalError: string;

  public switch(type: string): void {
    this.activity.type = type;

    if ((this.activity.type === "expense" && this.activity.amount > 0) || (this.activity.type === "income" && this.activity.amount < 0)) {
      this.activity.amount *= -1;
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
    if (this.activity.amount) {
      let amount = this.activity.amount.toString().replace(/[^\d.-]/g, "");

      if (this.activity.type === "expense" && amount.charAt(0) != "-") {
        amount = `-${amount}`;
      }

      this.activity.amount = amount;
    }
  }

  public formatTags() {
    let tags = this.activity.tags.split(" ");
    tags.forEach((tag, i) => {
      if (tag && tag.charAt(0) != "#") {
        tags[i] = `#${tag}`;
      }
    });
    this.activity.tags = tags.join(" ");
  }

  public validate(): void {
    this.submitted = true;

    if (!this.activity.title) return;

    if (!this.activity.category) return;

    if (!this.activity.amount) return;

    if (!this.activity.day) return;

    if (!this.activity.month) return;

    if (!this.activity.year) return;

    let formattedTags = this.activity.tags.trim();
    formattedTags = formattedTags.replace(/#/g, "");
    formattedTags = formattedTags.replace(/\s+/g, " ");

    let tags = formattedTags.length > 0 ? formattedTags.split(" ") : [];

    let activity = {
      title: this.activity.title,
      category: this.activity.category,
      currency: this.currency._id,
      amount: this.activity.amount,
      date: `${this.activity.year}-${this.activity.month}-${this.activity.day}`,
      tags: tags,
      description: this.activity.description,
      isExcluded: this.activity.isExcluded,
    };

    this.saving = true;

    this.saveActivity.emit(activity);

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

    this.errorSubscription = this.errorEvent.subscribe((error) => {
      this.error = error;
      this.saving = false;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.activity.type) {
      this.activity.type = "expense";
    }

    this.formatAmount();
    this.formatTags();
  }

  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
  }  
}
