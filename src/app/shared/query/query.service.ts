import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class QueryService {
  queryData$: Observable<string>;
  private querySubject = new Subject<string>();

  constructor() {
    this.queryData$ = this.querySubject.asObservable();
  }

  queryData(data) {
    //console.log(data);
    // I have data! Let's return it so subscribers can use it!
    // we can do stuff with data if we want
    this.querySubject.next(data);
  }
}
