import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ChartsModule } from "ng2-charts";
import { SearchBarComponent } from "./search-bar/search-bar.component";
import { ChartAreaComponent } from "./chart-area/chart-area.component";

import { Routes, RouterModule } from "@angular/router";
import {
  JiraDataService,
  AuthGuardService,
  LocalStorageService,
  ArrayToCsvPipe,
  QueryService
} from "./shared/index";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { HomeComponent } from "./home/home.component";
import { AuthComponent } from "./auth/auth.component";
import { StorageServiceModule } from "ngx-webstorage-service";
import { PrivacyComponent } from "./privacy/privacy.component";
import { httpInterceptorProviders } from "./http-interceptors/index";
import { LoadingComponent } from "./loading/loading.component";
import { CycleTimeComponent } from "./cycletime/cycletime.component";
import { Ng2GoogleChartsModule } from "ng2-google-charts";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MenuComponent, MenuSettingsDialog } from "./menu/menu.component";
import { ExportComponent } from "./export/export.component";
import { MaterialModule } from "./material.module";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";

const appRoutes: Routes = [
  {
    path: "privacy",
    component: PrivacyComponent
  },
  { path: "auth", component: AuthComponent },
  { path: "home", component: HomeComponent },
  {
    path: "report",
    component: ChartAreaComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "export",
    component: ExportComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "cycletime",
    component: CycleTimeComponent,
    canActivate: [AuthGuardService]
  },
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "**", redirectTo: "home" }
];

@NgModule({
  declarations: [
    AppComponent,
    SearchBarComponent,
    ChartAreaComponent,
    HomeComponent,
    AuthComponent,
    PrivacyComponent,
    LoadingComponent,
    CycleTimeComponent,
    MenuComponent,
    ExportComponent,
    MenuSettingsDialog,
    ArrayToCsvPipe
  ],
  entryComponents: [MenuSettingsDialog],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ChartsModule,
    CommonModule,
    FormsModule,
    StorageServiceModule,
    Ng2GoogleChartsModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [
    JiraDataService,
    AuthGuardService,
    LocalStorageService,
    httpInterceptorProviders,
    ArrayToCsvPipe,
    QueryService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: "fill" }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
