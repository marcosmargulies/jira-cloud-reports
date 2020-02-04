import { Pipe, PipeTransform } from "@angular/core";
import { DatePipe } from "@angular/common";

@Pipe({
  name: "arrayToCsvPipe"
})
export class ArrayToCsvPipe extends DatePipe implements PipeTransform {
  transform(value: Array<any>, args?: any): any {
    if (value) {
      let statuses = [];
      let dataSource = [];

      value.forEach(element => {
        let localData = new Object();
        element.statusHistory.forEach(history => {
          // Add new status to total statuses array
          if (statuses.indexOf(history.from) < 0) {
            statuses.push(history.from);
          }
          localData[history.from] = history.fromDateTime;
        });

        let item = {
          key: element.key,
          title: element.title,
          status: element.status,
          type: element.issuetype,
          resolution: element.resolution,
          data: localData
        };

        dataSource.push(item);
      });

      let response = `ID,Link,Name,${statuses.join(
        ","
      )},Type,Status,Resolution\n`;

      dataSource.forEach(item => {
        let test = ""; // statusDate[value[i].key].data;
        statuses.forEach(status => {
          test +=
            (item.data[status]
              ? super.transform(item.data[status], "yyyy-MM-dd hh:mm:ss")
              : "") + ",";
        });

        response += `${item.key},https://smith-nephew.atlassian.net/browse/${item.key},${item.title},${test},${item.type},${item.status}${item.resolution}\n`;
      });

      return response;
    }
    return "invalid data";
  }
}
