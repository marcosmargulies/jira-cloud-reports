import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  /*
  private headers: HttpHeaders = new HttpHeaders({
    'Content-type': 'application/json',
    'Authorization': 'Basic xxxxx'
  });
*/
  private jiraUrl = 'https://smith-nephew.atlassian.net/rest/api/3/';
  // private jiraUrl ='https://smith-nephew.atlassian.net/rest/api/3/project';
  constructor(private http: HttpClient) {}

  private getIssues(jqlString: string): Observable<any> {
    // Get API Key here: https://id.atlassian.com/manage/api-tokens
    // return this.http.get('./assets/json/jiramock.json');
    // return this.http.get(`${this.jiraUrl}`, {});
    // this.setAuth('xxxx','xxxx');
    // xxxxx:xxxxx
    const user = 'xxxxxx';
    const token = 'xxxxxx';
    const header = new HttpHeaders();
    header.append('Authorization', 'Basic ' + btoa(user + ':' + token));
    header.append('Content-type', 'application/json');

    const param = new HttpParams();
    param.append('jql', jqlString);
    param.append('maxResults', '100');
    param.append('expand', 'changelog,names');

    // TO DO: Authentication, proper POST
    /*
    return this.http.post(`${this.jiraUrl}search`, {
      headers: header,
      params: param
    });
*/

    return this.http
      .get(
        `${
          this.jiraUrl
        }search?jql=${jqlString}&maxResults=100&expand=changelog,names`,
        {}
      )
      .pipe(map((response, any) => response));
    /*
    return this.post(`${this.jiraUrl}search`, {
      jql: jqlString,
      maxResults: 100,
      expand: ['changelog', 'names']
    });
    */
  }
  /*
private post(url: string, body: any): Observable<any> {
    return this.http
      .post(url, body, { headers: this.headers, withCredentials: true })
      .pipe(map((response, any) => response));
  }
*/
  private handleError(error: any): void {
    console.log(error);
  }

  public getDaysPerStatus(query: string): Observable<any> {
    const obs = this.getIssues(query).pipe(
      map(data => {
        const a: Array<any> = [];
        data.issues.forEach(issue => {
          // console.log("issue:"); console.dir(issue);
          a.push({
            key: issue.key,
            title: issue.fields.summary,
            created: issue.fields.created,
            updated: issue.fields.updated,
            issuetype: issue.fields.issuetype.name,
            project: issue.fields.project.name,
            // team: issue.fields.customfield_11716.value,
            estimate: issue.fields.customfield_10002,
            status: issue.fields.status.name,
            statusId: issue.fields.status.id,
            statusHistory: (function(changelog) {
              const filteredStatusHistory: Array<any> = [];
              const statusHistory: Array<any> = [];
              //console.log('history');
              //console.log(changelog.histories);
              // This is for classic-gen:
              // for (let _i = 0; _i <= changelog.histories.length - 1; _i++) {

              // This is for new-gen:
              for (let _i = changelog.histories.length - 1; _i >= 0; _i--) {
                const history = changelog.histories[_i];
                const statusHistoryItem = history.items.filter(
                  historyItem => historyItem.field === 'status'
                );
                if (statusHistoryItem.length > 0) {
                  statusHistoryItem.created = history.created;
                  filteredStatusHistory.push(statusHistoryItem);
                }
              }
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
                  from: status[0]['fromString'],
                  to: status[0]['toString']
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
                    from: status[0]['toString'],
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
              return statusHistory;
            })(issue.changelog)
          });
        });
        return a;
      })
    );
    return obs;
  }
  /*
  private setAuth(username: string, pass: string) {
    this.headers.append(
      'Authorization',
      'Basic ' + window.btoa(`${username}:${pass}`)
    );
  }*/
}
