import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChartsModule } from 'ng2-charts';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { ChartAreaComponent } from './chart-area/chart-area.component';

import { Routes, RouterModule } from '@angular/router';
import {
  JiraDataService,
  AuthGuardService,
  LocalStorageService
} from './shared/index';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { StorageServiceModule } from 'ngx-webstorage-service';
import { PrivacyComponent } from './privacy/privacy.component';
import { httpInterceptorProviders } from './http-interceptors/index';
import { LoadingComponent } from './loading/loading.component';

const appRoutes: Routes = [
  {
    path: 'privacy',
    component: PrivacyComponent
  },
  {
    path: 'report',
    component: ChartAreaComponent,
    canActivate: [AuthGuardService]
  },
  { path: 'auth', component: AuthComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  declarations: [
    AppComponent,
    SearchBarComponent,
    ChartAreaComponent,
    HomeComponent,
    AuthComponent,
    PrivacyComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ChartsModule,
    CommonModule,
    FormsModule,
    StorageServiceModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    JiraDataService,
    AuthGuardService,
    LocalStorageService,
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
