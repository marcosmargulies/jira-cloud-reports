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
    'project = CLOUD AND type != EPIC and updatedDate <= startOfDay(-14d) and type in ("SNOW Task", "FrontDoor Task") and status in (Done, "In Progress")';

  constructor(private queryService: QueryService) {
    this.queryService.queryData(this.query);
  }

  ngOnInit() {}

  searchQuery() {
    this.queryService.queryData(this.query);
  }
}
