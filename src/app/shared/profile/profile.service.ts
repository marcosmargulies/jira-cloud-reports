import { Injectable } from "@angular/core";
import { LocalStorageService } from "../local-storage/local.storage.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AccessToken } from "src/app/models/access-token.model";
import { map } from "rxjs/operators";
import { Observable } from "rxjs/internal/Observable";
import { ReplaySubject } from "rxjs/internal/ReplaySubject";
import { Profile } from "src/app/models/profile.model";

@Injectable({
  providedIn: "root"
})
export class ProfileService {
  constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService
  ) {}

  public profile: ReplaySubject<any> = new ReplaySubject(1);

  public getProfile(): Observable<Profile> {
    const token: AccessToken = this.localStorage.getTokenOnLocalStorage();
    const jiraUrl = this.localStorage.getJiraRestAddress();
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: "application/json",
        "Content-Type": "application/json",
        "Response-Type": "application/json",
        Authorization: token ? `${token.token_type} ${token.access_token}` : ""
      })
    };

    const url = encodeURI(`${jiraUrl}myself`);
    return this.http.get<Profile>(url, httpOptions);
  }

  public getProfileAsync() {
    const token: AccessToken = this.localStorage.getTokenOnLocalStorage();
    const jiraUrl = this.localStorage.getJiraRestAddress();
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: "application/json",
        "Content-Type": "application/json",
        "Response-Type": "application/json",
        Authorization: token ? `${token.token_type} ${token.access_token}` : ""
      })
    };

    const url = encodeURI(`${jiraUrl}myself`);
    this.http.get(url, httpOptions).subscribe(res => this.profile.next(res));
    return this.profile;
  }
}
