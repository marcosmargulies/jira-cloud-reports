import { Component, OnInit } from "@angular/core";
import { GoogleChartInterface } from "ng2-google-charts/google-charts-interfaces";
import { ChartSelectEvent } from "ng2-google-charts";
import { JiraDataService, LocalStorageService } from "../shared/index";
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
  query =
    "project = CP and sprint in openSprints() and key in (CP-881, CP-883)";

  usedStatus = [];
  unusedStatus = [];
  private datasource = [];
  showChart = true;
  jiraResult = [];
  outputType = "date";

  constructor(
    private dataService: JiraDataService,
    private localStorage: LocalStorageService
  ) {}

  ngOnInit() {
    this.getDataFromJIRA();
  }
  radioChanged(e: any) {
    this.outputType = e.target.value;
  }
  export(value: string) {
    let filename = "cycle_extract.csv";
    var csvData = value;
    var blob = new Blob([csvData], { type: "text/csv" });
    var url = window.URL.createObjectURL(blob);

    if (navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, filename);
    } else {
      var a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    window.URL.revokeObjectURL(url);
  }

  public chartSelectHandler(e: ChartSelectEvent) {
    let datasetLabel = e.columnLabel;
    if (datasetLabel && datasetLabel !== "Average") {
      let url = this.localStorage.getTokenOnLocalStorage().resources[0].url;
      window.open(`${url}/browse/${datasetLabel}`, "_blank");
    }
  }

  onEnter(value: string) {
    this.query = value;
    this.getDataFromJIRA();
    console.log(this.datasource.length);
  }

  getDataFromJIRA() {
    this.showChart = false;
    this.dataService.getDaysPerStatus(this.query).subscribe(data => {
      this.jiraResult = data;

      // console.log("tickets from jira:");      console.dir(this.jiraResult);
      this.pretifyJiraData(this.jiraResult);
      this.refreshChart();

      // console.log("Parsed result:");      console.log(this.parseSource());
      this.showChart = true;
    });
  }

  private parseSource(): GoogleChartInterface["dataTable"] {
    let res: GoogleChartInterface["dataTable"] = [];

    let header: Array<any> = [];
    header.push("Keys");
    header.push("Average");
    this.datasource.forEach(element => {
      header.push(element.key);
    });
    res.push(header);

    for (let i = 0; i <= this.usedStatus.length; i++) {}
    this.usedStatus.forEach(_status => {
      let row: Array<any> = [];
      let total: number = 0;
      let control: number = 0;
      this.datasource.forEach(_dataSource => {
        row.push(_dataSource.data[_status] || 0);
        total += _dataSource.data[_status] || 0;
        control += _dataSource.data[_status] ? 1 : 0;
      });
      // Add Average in the beggining of the Array
      row.unshift(total / control);
      row.unshift(_status);

      res.push(row);
    });
    //console.log(res);
    return res;
  }

  public chartData: GoogleChartInterface = {
    chartType: "ComboChart",
    dataTable: this.parseSource(),
    //firstRowIsData: true,
    options: {
      title: "Cycle time by JIRA keys",
      vAxis: { title: "Time (in days)" },
      hAxis: { title: "Status" },
      seriesType: "bars",
      series: { 0: { type: "line" } }
    }
  };

  drop(event: CdkDragDrop<string[]>) {
    if (
      event.previousContainer.id === "cdk-drop-list-used" &&
      event.previousContainer.data.length === 1
    ) {
      return;
    }
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
    //console.log(this.usedStatus);

    this.refreshChart();
  }

  refreshChart() {
    let ccComponent = this.chartData.component;
    if (ccComponent) {
      ccComponent.data.dataTable = this.parseSource();
      //let ccWrapper = ccComponent.wrapper;
      //force a redraw
      ccComponent.draw();
    }
  }

  private pretifyJiraData(jiraData: any) {
    this.datasource = [];
    this.usedStatus = [];
    this.unusedStatus = [];

    jiraData.forEach(element => {
      let localData = new Object();
      element.statusHistory.forEach(history => {
        // Add new status to total statuses array
        if (this.usedStatus.indexOf(history.from) < 0) {
          this.usedStatus.push(history.from);
        }
        localData[history.from] = history.transitionDurationDays;
      });

      let item = {
        key: element.key,
        title: element.title,
        status: element.status,
        data: localData
      };
      this.datasource.push(item);
    });
  }
}
