import { Component, OnInit } from "@angular/core";
import { QueryService } from "../shared";

@Component({
  selector: "app-search-bar",
  templateUrl: "./search-bar.component.html",
  styleUrls: ["./search-bar.component.css"]
})
export class SearchBarComponent implements OnInit {
  //public data: Array<any> = MyData;
  public query: string =
    "project = CLOUD AND NOT (resolution = Done AND resolutiondate < -14d AND status in (Done)) AND type != EPIC";

  constructor(private queryService: QueryService) {
    this.queryService.queryData(this.query);
  }

  ngOnInit() {}

  searchQuery() {
    this.queryService.queryData(this.query);
  }
}
