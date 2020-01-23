import { Component, OnInit } from "@angular/core";
import { GoogleChartInterface } from "ng2-google-charts/google-charts-interfaces";
import {
  DataPointPosition,
  BoundingBox,
  ChartHTMLTooltip,
  ChartMouseOverEvent
} from "ng2-google-charts";
import { JiraDataService } from "../shared/index";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";

@Component({
  selector: "app-testchart",
  templateUrl: "./testchart.component.html",
  styleUrls: ["./testchart.component.css"]
})
export class TestchartComponent implements OnInit {
  query = "project = CP and sprint in openSprints()";

  constructor(private dataService: JiraDataService) {}

  ngOnInit() {
    /*this.dataService.getDaysPerStatus(this.query).subscribe(data => {
      console.log("tickets from jira:");
      console.dir(data);
    });*/
  }

  public comboChart: GoogleChartInterface = {
    chartType: "ComboChart",
    dataTable: [
      [
        "Month",
        "Bolivia",
        "Ecuador",
        "Madagascar",
        "Papua New Guinea",
        "Rwanda",
        "Average"
      ],
      ["2004/05", 165, 938, 522, 998, 450, 614.6],
      ["2005/06", 135, 1120, 599, 1268, 288, 682],
      ["2006/07", 157, 1167, 587, 807, 397, 623],
      ["2007/08", 139, 1110, 615, 968, 215, 609.4],
      ["2008/09", 136, 691, 629, 1026, 366, 569.6]
    ],
    //firstRowIsData: true,
    options: {
      title: "Monthly Coffee Production by Country",
      vAxis: { title: "Cups" },
      hAxis: { title: "Month" },
      seriesType: "bars",
      series: { 5: { type: "line" } }
    }
  };
  public mouseOver(event: ChartMouseOverEvent) {
    //console.log(event, event.columnLabel, ": ", event.value);
  }

  // Start testing
  private working: GoogleChartInterface["dataTable"] = [
    [
      "Month",
      "Bolivia",
      "Ecuador",
      "Madagascar",
      "Papua New Guinea",
      "Rwanda",
      "Average"
    ],
    ["2004/05", 165, 938, 522, 998, 450, 614.6],
    ["2005/06", 135, 1120, 599, 1268, 288, 682],
    ["2006/07", 157, 1167, 587, 807, 397, 623],
    ["2007/08", 139, 1110, 615, 968, 215, 609.4],
    ["2008/09", 136, 691, 629, 1026, 366, 569.6]
  ];

  usedStatus = ["To Do", "In Progress", "Done"];
  unusedStatus = [];
  private datasource = [
    { key: "123", data: { "To Do": 1, "In Progress": 2, Done: 3 } },
    { key: "231", data: { "To Do": 2, "In Progress": 4, Done: 6 } },
    { key: "543", data: { "To Do": 6, Done: 5 } },
    { key: "536", data: { "To Do": 3, "In Progress": 7, Done: 2 } }
  ];

  private parseSource(): GoogleChartInterface["dataTable"] {
    let res: GoogleChartInterface["dataTable"] = [];

    let header: Array<any> = [];
    header.push("Time");
    this.datasource.forEach(element => {
      header.push(element.key);
    });
    res.push(header);

    for (let i = 0; i <= this.usedStatus.length; i++) {}
    this.usedStatus.forEach(_status => {
      let row: Array<any> = [];
      row.push(_status);
      this.datasource.forEach(_dataSource => {
        row.push(_dataSource.data[_status] || 0);
      });
      res.push(row);
    });
    // console.log(res);
    return res;
  }

  public testChart: GoogleChartInterface = {
    chartType: "ComboChart",
    dataTable: this.parseSource(),
    //firstRowIsData: true,
    options: {
      title: "Cycle time by JIRA keys",
      vAxis: { title: "Time" },
      hAxis: { title: "Status" },
      seriesType: "bars"
      //series: { 5: { type: "line" } }
    }
  };

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer !== event.container) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      moveItemInArray(this.usedStatus, event.previousIndex, event.currentIndex);
    }
    console.log(this.usedStatus);
  }
  // Finish testing
}
