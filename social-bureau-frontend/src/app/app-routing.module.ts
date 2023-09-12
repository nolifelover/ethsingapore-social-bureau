import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReportCrimeComponent } from "./@page/report-crime/report-crime.component";
import { Page404Component } from "./@page/page404/page404.component";
import { BackgroundCheckComponent } from "./@page/background-check/background-check.component";
// import { YourProfileComponent } from "./@page/your-profile/your-profile.component";
import { CrimesComponent } from "./@page/crimes/crimes.component";
import { CrimeDetailComponent } from "./@page/crime-detail/crime-detail.component";
import { JwtGuard } from "./@guard/jwt.guard";
import { GuestGuard } from "./@guard/guest.guard";
import { StakeComponent } from "./@page/stake/stake.component";
import { YourProfileComponent } from "./@page/your-profile/your-profile.component";
import { HistoryComponent } from "./@page/history/history.component";

const routes: Routes = [
  {
    path: "",
    component: BackgroundCheckComponent,
    canActivate: [GuestGuard],
  },
  {
    path: "background-check",
    component: BackgroundCheckComponent,
    canActivate: [GuestGuard],
  },
  {
    path: "crimes",
    component: CrimesComponent,
    canActivate: [GuestGuard],
  },
  {
    path: "crime/:report-id",
    component: CrimeDetailComponent,
    canActivate: [GuestGuard],
  },
  {
    path: "report-crime",
    component: ReportCrimeComponent,
    canActivate: [JwtGuard],
  },
  {
    path: "stake",
    component: StakeComponent,
    canActivate: [JwtGuard],
  },
  {
    path: "your-profile",
    component: YourProfileComponent,
    canActivate: [JwtGuard],
  },
  {
    path: "history",
    component: HistoryComponent,
    canActivate: [JwtGuard],
  },
  {
    path: "404",
    component: Page404Component,
  },
  {
    path: "**",
    redirectTo: "/404", // Error 404 - Page not found
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
