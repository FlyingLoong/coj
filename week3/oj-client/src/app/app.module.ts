import { provideAuth } from 'angular2-jwt';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ProblemListComponent } from './components/problem-list/problem-list.component';
import { ProblemDetailComponent } from './components/problem-detail/problem-detail.component';

import { ProblemService } from './services/problem.service';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';

import { routing } from './app.routes';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NewProblemComponent } from './components/new-problem/new-problem.component';
import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    ProblemListComponent,
    ProblemDetailComponent,
    NavbarComponent,
    NewProblemComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [
    {
      provide: "data",
      useClass: ProblemService
    },
    {
      provide: "auth",
      useClass: AuthService
    },
    {
      provide: "authGuard",
      useClass: AuthGuardService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
