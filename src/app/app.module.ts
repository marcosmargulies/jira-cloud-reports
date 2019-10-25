import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChartsModule } from 'ng2-charts';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { ChartAreaComponent } from './chart-area/chart-area.component';

import { SearchComponent } from './search/search.component';
import { Routes, RouterModule } from '@angular/router';
import {
  SearchService,
  JiraDataService,
  AuthGuardService,
  LocalStorageService
} from './shared/index';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { StorageServiceModule } from 'ngx-webstorage-service';

const appRoutes: Routes = [
  {
    path: 'search',
    component: SearchComponent,
    canActivate: [AuthGuardService]
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
    SearchComponent,
    HomeComponent,
    AuthComponent
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
    SearchService,
    AuthGuardService,
    LocalStorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
