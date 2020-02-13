import { Injectable } from "@angular/core";
import { LocalStorageService } from "../local-storage/local.storage.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AccessToken } from "src/app/models/access-token.model";
import { map } from "rxjs/operators";
import { Observable } from "rxjs/internal/Observable";
import { ReplaySubject } from "rxjs/internal/ReplaySubject";
import { Profile } from "src/app/models/profile.model";
import { Subject } from "rxjs/internal/Subject";

@Injectable({
  providedIn: "root"
})
export class ProfileService {
  profileData$: Observable<any>;
  private profileSubject = new Subject<any>();

  constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService
  ) {}

  public profile: ReplaySubject<any> = new ReplaySubject(1);

  public getProfile(): Observable<Profile> {
    const token: AccessToken = this.localStorage.getAuthenticationTokenOnLocalStorage();
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
}
