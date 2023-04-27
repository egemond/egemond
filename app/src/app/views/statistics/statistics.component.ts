import { Component, OnInit, LOCALE_ID } from "@angular/core";
import { CurrencyPipe } from "@angular/common";

import { ActivitiesService } from "../../services/activities.service";
import { AppService } from "../../services/app.service";
import { CategoriesService } from "../../services/categories.service";

import * as echarts from "echarts";

@Component({
  selector: "app-statistics",
  templateUrl: "./statistics.component.html",
  styleUrls: ["./statistics.component.css"],
  providers: [
    {
      provide: LOCALE_ID,
      useFactory: (appService: AppService) => {
        return appService.getLanguage();
      },
      deps: [AppService],
    },
    CurrencyPipe,
  ],
})
export class StatisticsComponent implements OnInit {
  constructor(private activitiesService: ActivitiesService, private appService: AppService, private categoriesService: CategoriesService, private currencyPipe: CurrencyPipe) {}

  public categories: any;

  public selected: boolean = false;

  public selectedIndex: number;

  public type: string = "expenses";

  public total: any = {
    expenses: 0.0,
    incomes: 0.0,
  };

  public currencyId: string;

  private chart: echarts.ECharts;

  public retrievalError: string;

  public switch(type: string): void {
    if (type != this.type) {
      this.deselectCategory();

      this.type = type;
      this.updateView();
    }
  }

  public selectCategory(i: number): void {
    this.selected = true;
    this.selectedIndex = i;
  }

  public deselectCategory(): void {
    this.selected = false;
    this.selectedIndex = null;
  }

  public updateView(): void {
    this.sortCategories();
    this.drawChart();
  }

  private drawChart(): void {
    var data = [];
    var colors = [];
    this.categories.forEach(category => {
      if (category[this.type].total != 0) {
        data.push({
          name: category.title,
          value: Math.abs(category[this.type].total),
        });

        colors.push(category.color);
      }
    });

    this.chart.clear();
    this.chart.setOption({
      title: {
        text: this.currencyPipe.transform(this.total[this.type], this.currencyId, "symbol-narrow", "1.2-2"),
        top: "center",
        left: "center",
        textStyle: {
          fontFamily: "'Inter', sans-serif",
          fontSize: 28,
          fontWeight: 500,
        },
      },
      series: [
        {
          type: "pie",
          radius: ["75%", "100%"],
          avoidLabelOverlap: false,
          color: colors,
          hoverOffset: 20,
          cursor: "default",
          label: {
            show: false,
            position: "center",
          },
          labelLine: {
            show: false,
          },
          data: data,
          emphasis: {
            disabled: true,
          },
        },
      ],
    });
  }

  private getCategories(): void {
    this.categoriesService.getCategories()
      .then((categories: any) => {
        categories.forEach(category => {
          category.expenses = {
            dates: [],
            total: 0,
            currency: this.currencyId,
          };
          category.incomes = {
            dates: [],
            total: 0,
            currency: this.currencyId,
          };
        });

        this.activitiesService.getActivities()
          .then(activities => {
            activities.forEach(activity => {
              let category = categories.findIndex(category => category._id === activity.category._id);
              let date = new Date(activity.date);
              if (activity.amount < 0) {
                if (!categories[category].expenses.dates.hasOwnProperty(date.getTime())) {
                  categories[category].expenses.dates[date.getTime()] = {
                    date: date,
                    activities: [],
                  };
                }
                categories[category].expenses.dates[date.getTime()].activities.push(activity);

                categories[category].expenses.currency = activity.currency._id;
                if (!activity.isExcluded) {
                  categories[category].expenses.total += activity.amount;
                }

                this.total.currency = activity.currency;
                if (!activity.isExcluded) {
                  this.total.expenses += activity.amount;
                }
              } else {
                if (!categories[category].incomes.dates.hasOwnProperty(date.getTime())) {
                  categories[category].incomes.dates[date.getTime()] = {
                    date: date,
                    activities: [],
                  };
                }
                categories[category].incomes.dates[date.getTime()].activities.push(activity);

                categories[category].incomes.currency = activity.currency._id;
                if (!activity.isExcluded) {
                  categories[category].incomes.total += activity.amount;
                }
                
                this.total.currency = activity.currency;
                if (!activity.isExcluded) {
                  this.total.incomes += activity.amount;
                }
              }
            });

            categories.forEach(category => {
              category.expenses.dates = Object.keys(category.expenses.dates).map((date) => {
                return {
                  date: category.expenses.dates[date].date,
                  activities: category.expenses.dates[date].activities,
                };
              });

              category.incomes.dates = Object.keys(category.incomes.dates).map((date) => {
                return {
                  date: category.incomes.dates[date].date,
                  activities: category.incomes.dates[date].activities,
                };
              });
            });

            this.categories = categories;
            this.updateView();
          })
          .catch((error) => {
            this.retrievalError = error;
          });
      })
      .catch((error) => {
        this.retrievalError = error;
      });
  }

  private sortCategories(): void {
    this.categories = this.categories.sort((x, y) => {
      if (this.type === "expenses") {
        if (x.expenses.total < y.expenses.total) {
          return -1;
        } else if (x.expenses.total > y.expenses.total) {
          return 1;
        } else {
          return 0;
        }
      } else {
        if (x.incomes.total > y.incomes.total) {
          return -1;
        } else if (x.incomes.total < y.incomes.total) {
          return 1;
        } else {
          return 0;
        }
      }
    });
  }

  ngOnInit(): void {
    let chartContainer = document.querySelector("#chart") as HTMLElement;
    this.chart = echarts.init(chartContainer);
    new ResizeObserver(() => this.chart.resize()).observe(chartContainer);

    this.currencyId = this.appService.getCurrency();

    this.getCategories();
  }
}
