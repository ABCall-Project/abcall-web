import { Routes } from '@angular/router';
import { IssuesComponent } from './issues/issues.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const AppsRoutes: Routes = [
  {
    path: 'issues',
    component: IssuesComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
];
