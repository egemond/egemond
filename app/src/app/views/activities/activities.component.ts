import { Component, OnInit, LOCALE_ID, HostListener } from "@angular/core";
import { getCurrencySymbol } from "@angular/common";

import { ActivitiesService } from "../../services/activities.service";
import { AppService } from "../../services/app.service";

import { MonthPipe } from "../../pipes/month.pipe";
import { LocalizePipe } from "../../pipes/localize.pipe";

import * as echarts from "echarts";
import { DateTime } from "luxon";

@Component({
  selector: "app-activities",
  templateUrl: "./activities.component.html",
  styleUrls: ["./activities.component.css"],
  providers: [
    {
      provide: LOCALE_ID,
      useFactory: (appService: AppService) => {
        return appService.getLanguage();
      },
      deps: [AppService],
    },
    MonthPipe,
    LocalizePipe,
  ],
})
export class ActivitiesComponent implements OnInit {
  constructor(private activitiesService: ActivitiesService, private appService: AppService, private monthPipe: MonthPipe, private localizePipe: LocalizePipe) {}

  public total: number;

  public currencyId: string;

  public years: any[];
  public currentYear: number = 0;
  public currentMonth: number = 2;
  public shouldShowMoreActivities: boolean = true;

  private chart: echarts.ECharts;

  public retrievalError: string;

  private getActivities(): void {
    this.activitiesService.getActivities().subscribe({
      next: ((activities) => {
        let total = 0.0;
        let years = {};

        activities.forEach((activity) => {
          activity.date = new Date(activity.date);
          let year = activity.date.getFullYear();
          let month = activity.date.getMonth();
          let day = activity.date.getDate();
  
          if (!(year in years)) {
            years[year] = {
              total: 0,
              currency: activity.currency,
              months: new Object(),
            };
          }

          if (!(month in years[year]["months"])) {
            years[year]["months"][month] = {
              total: 0,
              expenses: 0,
              incomes: 0,
              currency: activity.currency,
              days: new Object(),
            };
          }

          if (!(day in years[year]["months"][month]["days"])) {
            years[year]["months"][month]["days"][day] = {
              activities: [],
              date: activity.date,
              total: 0,
              currency: activity.currency,
            };
          }

          years[year]["months"][month]["days"][day]["activities"].push(activity);
          if (!activity.isExcluded) {
            total += activity.amount;

            years[year]["total"] += activity.amount;

            years[year]["months"][month]["total"] += activity.amount;
            if (activity.amount < 0) {
              years[year]["months"][month]["expenses"] += activity.amount;
            }
            else {
              years[year]["months"][month]["incomes"] += activity.amount;
            }

            years[year]["months"][month]["days"][day]["total"] += activity.amount;
          }
        });

        let months = [];
        let expenses = [];
        let incomes = [];
        const monthsOnChart = 6;
        for (var date = DateTime.now().startOf("month").minus({months: monthsOnChart}); date <= DateTime.now(); date = date.plus({months: 1})) {
          let monthName = this.monthPipe.transform(date.month - 1);
          let monthLocalized = this.localizePipe.transform(monthName);
          months.push(monthLocalized);
          expenses.push(0);
          incomes.push(0);
        }

        this.total = total;
        this.years = Object.keys(years).map((year) => {
          return {
            months: Object.keys(years[year]["months"])
              .map((month) => {
                let startOfCurrentMonth = DateTime.now().startOf("month");
                let startOfMappedMonth = DateTime.local(parseInt(year), parseInt(month) + 1, 1).startOf("month");
                let monthDifference = startOfCurrentMonth.diff(startOfMappedMonth, "months").toObject();

                let i = monthsOnChart - monthDifference.months;
                expenses[i] = Math.abs(years[year]["months"][month]["expenses"]);
                incomes[i] = Math.abs(years[year]["months"][month]["incomes"]);

                return {
                  days: Object.keys(years[year]["months"][month]["days"])
                    .map((day) => {
                      return {
                        activities: years[year]["months"][month]["days"][day]["activities"],
                        date: years[year]["months"][month]["days"][day]["date"],
                        total: years[year]["months"][month]["days"][day]["total"],
                        currency: years[year]["months"][month]["days"][day]["currency"],
                      };
                    })
                    .reverse(),
                  month: month,
                  total: years[year]["months"][month]["total"],
                  currency: years[year]["months"][month]["currency"],
                };
              })
              .reverse(),
            year: year,
            total: years[year]["total"],
            currency: years[year]["currency"],
          };
        })
        .reverse();


        months = months.slice(Math.max(months.length - 6, 0));
        expenses = expenses.slice(Math.max(expenses.length - 6, 0));
        incomes = incomes.slice(Math.max(incomes.length - 6, 0));

        let lineColor = "#a9c8ef";
        let textColor = "#2e3036";
        if (this.appService.getTheme() == "dark") {
          lineColor = "#212529";
          textColor = "#fff";
        }

        this.chart.setOption({
          xAxis: {
            axisLine: {
              lineStyle: {
                color: lineColor,
                type: "dashed",
              },
            },
            data: months,
            axisTick: {
              show: false,
            },
          },
          yAxis: {
            axisLabel: {
              show: false,
              formatter: `{value} ${getCurrencySymbol(this.currencyId, "narrow")}`,
            },
            splitLine: {
              show: false,
            },
          },
          grid: {
            left: 10,
            right: 10,
            top: 40,
            bottom: 40,
            show: false,
          },
          series: [
            {
              color: ["#e64d61"],
              data: expenses,
              type: "bar",
              cursor: "default",
              itemStyle: {
                borderRadius: [6, 6, 0, 0],
              },
              emphasis: {
                disabled: true,
              },
            },
            {
              color: ["#67cb71"],
              data: incomes,
              type: "bar",
              cursor: "default",
              itemStyle: {
                borderRadius: [6, 6, 0, 0],
              },
              emphasis: {
                disabled: true,
              },
            },
          ],
          textStyle: {
            color: textColor,
            fontFamily: "'Inter', sans-serif",
          },
        });
      }),
      error: ((error) => {
        this.retrievalError = this.appService.getErrorMessage(error);
      }),
    }).add(() => {
        this.showInitialActivities();
    });
  }

  public showInitialActivities(): void {
    setTimeout(() => {
      if (this.shouldShowMoreActivities && !(document.body.scrollHeight > document.body.clientHeight)) {
        this.showMoreActivities();
        this.showInitialActivities();
      }
    }, 5);
  }

  @HostListener("window:scroll", ['$event'])
  onScroll(): void {
    if (this.shouldShowMoreActivities && window.innerHeight + window.scrollY + 16 >= document.documentElement.scrollHeight) {
      this.showMoreActivities();
    }
  }

  public showMoreActivities(): void {
    if (this.years[this.currentYear].months.length > this.currentMonth + 1) {
      this.currentMonth += 1;
      return;
    } else if (this.years.length > this.currentYear + 1) {
      this.currentYear += 1;
      this.currentMonth = 2;
      return;
    } else {
      this.shouldShowMoreActivities = false;
    }
  }

  ngOnInit(): void {
    let chartContainer = document.querySelector("#chart") as HTMLElement;
    this.chart = echarts.init(chartContainer);
    new ResizeObserver(() => this.chart.resize()).observe(chartContainer);

    this.currencyId = this.appService.getCurrency();

    this.getActivities();
  }
}
