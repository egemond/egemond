import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "month",
})
export class MonthPipe implements PipeTransform {
  transform(value: number): string {
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return months[value] ? months[value] : value.toString();
  }
}
