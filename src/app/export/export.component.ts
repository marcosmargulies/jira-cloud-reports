import { Component, OnInit } from "@angular/core";
import { JiraDataService } from "../shared/jira-data/jira-data.service";

@Component({
  selector: "app-export",
  templateUrl: "./export.component.html",
  styleUrls: ["./export.component.css"]
})
export class ExportComponent implements OnInit {
  query = "project = CP and sprint in openSprints()";
  result: Array<any> = [];
  constructor(private dataService: JiraDataService) {}

  ngOnInit() {}

  onEnter(value: string) {
    this.query = value;
    this.getJiraData();
  }

  getJiraData() {
    this.dataService.getDaysPerStatus(this.query).subscribe(data => {
      data.forEach(element => {
        this.result.push(element);
      });
      console.log(this.result);
    });
  }
}
