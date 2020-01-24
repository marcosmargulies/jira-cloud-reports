import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { map } from "rxjs/operators";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse
} from "@angular/common/http";
import { LocalStorageService } from "../local-storage/local.storage.service";
import { AccessToken } from "src/app/models/access-token.module";

@Injectable({
  providedIn: "root"
})
export class JiraDataService {
  constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService
  ) {}

  private getIssues(jqlString: string): Observable<any> {
    const header = new HttpHeaders();
    header.append("Content-type", "application/json");

    const param = new HttpParams();
    param.append("jql", jqlString);
    param.append("maxResults", "100");
    param.append("expand", "changelog,names");

    const token: AccessToken = this.localStorage.getTokenOnLocalStorage();
    const jiraUrl = `https://api.atlassian.com/ex/jira/${
      token ? token.resources[0].id : ""
    }/rest/api/3/`;

    // TO DO: proper POST
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: "application/json",
        "Content-Type": "application/json",
        "Response-Type": "application/json",
        Authorization: token ? `${token.token_type} ${token.access_token}` : ""
      })
    };
    const post = false;
    if (post) {
      return this.http
        .post(
          `${jiraUrl}search`,
          {
            jql: "key=CP-241",
            maxResults: 100,
            expand: ["changelog", "names"]
          },
          httpOptions
        )
        .pipe(map((response, any) => response));
    } else {
      const url = encodeURI(
        `${jiraUrl}search?jql=${jqlString}&maxResults=100&expand=changelog,names`
      );

      return this.http
        .get(url, httpOptions)
        .pipe(map((response, any) => response));
    }
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError("Something bad happened; please try again later.");
  }

  public getDaysPerStatus(query: string): Observable<any> {
    const obs = this.getIssues(query).pipe(
      map(data => {
        const a: Array<any> = [];
        data.issues.forEach(issue => {
          a.push({
            key: issue.key,
            title: issue.fields.summary,
            created: issue.fields.created,
            updated: issue.fields.updated,
            issuetype: issue.fields.issuetype.name,
            project: issue.fields.project.name,
            //estimate: issue.fields.customfield_10002,
            status: issue.fields.status.name,
            statusId: issue.fields.status.id,
            statusHistory: (function(changelog) {
              const filteredStatusHistory: Array<any> = [];
              const statusHistory: Array<any> = [];

              changelog.histories = changelog.histories.sort((n1, n2) => {
                if (n1.created > n2.created) {
                  return 1;
                }
                if (n1.created < n2.created) {
                  return -1;
                }
                return 0;
              });

              for (let _i = 0; _i <= changelog.histories.length - 1; _i++) {
                const history = changelog.histories[_i];
                const statusHistoryItem = history.items.filter(
                  historyItem => historyItem.field === "status"
                );
                if (statusHistoryItem.length > 0) {
                  statusHistoryItem.created = history.created;
                  filteredStatusHistory.push(statusHistoryItem);
                }
              }

              if (filteredStatusHistory.length === 0) {
                let hours =
                  Math.abs(
                    new Date(Date.now()).getTime() -
                      new Date(issue.fields.created).getTime()
                  ) /
                  (1000 * 60 * 60);
                let days =
                  Math.abs(
                    new Date(Date.now()).getTime() -
                      new Date(issue.fields.created).getTime()
                  ) / 86400000;

                let onlyHistory = {
                  fromDateTime: issue.fields.created,
                  toDateTime: Date.now(),
                  transitionDurationHours: hours,
                  transitionDurationDays: days,
                  from: issue.fields.status.name,
                  to: null
                };
                statusHistory.push(onlyHistory);
              } else {
                for (let _i = 0; _i < filteredStatusHistory.length; _i++) {
                  const status = filteredStatusHistory[_i];
                  const fromDt =
                    statusHistory.length > 0
                      ? statusHistory[statusHistory.length - 1].toDateTime
                      : issue.fields.created;

                  const sh = {
                    fromDateTime: fromDt,
                    toDateTime: status.created,
                    transitionDurationHours: 0,
                    transitionDurationDays: 0,
                    from: status[0]["fromString"],
                    to: status[0]["toString"]
                  };
                  sh.transitionDurationHours =
                    Math.abs(
                      new Date(sh.toDateTime).getTime() -
                        new Date(sh.fromDateTime).getTime()
                    ) /
                    (1000 * 60 * 60);
                  sh.transitionDurationDays =
                    Math.abs(
                      new Date(sh.toDateTime).getTime() -
                        new Date(sh.fromDateTime).getTime()
                    ) / 86400000;

                  // const sh = this.createIssueLog(fromDt, status.created, status[0]['fromString'], status[0]['toString']);
                  statusHistory.push(sh);

                  if (_i === filteredStatusHistory.length - 1) {
                    const shLast = {
                      fromDateTime: status.created,
                      toDateTime: Date.now(),
                      transitionDurationHours: 0,
                      transitionDurationDays: 0,
                      from: status[0]["toString"],
                      to: null
                    };
                    shLast.transitionDurationHours =
                      Math.abs(
                        new Date(shLast.toDateTime).getTime() -
                          new Date(shLast.fromDateTime).getTime()
                      ) /
                      (1000 * 60 * 60);
                    shLast.transitionDurationDays =
                      Math.abs(
                        new Date(shLast.toDateTime).getTime() -
                          new Date(shLast.fromDateTime).getTime()
                      ) / 86400000;

                    // const shLast = this.createIssueLog(this.createIssueLog(status.created, Date.now(), status[0]['toString'], null));
                    statusHistory.push(shLast);
                  }
                }
                //console.log("statusHistory:");console.dir(statusHistory);
              }
              return statusHistory;
            })(issue.changelog)
          });
        });
        return a;
      })
    );
    return obs;
  }
}
