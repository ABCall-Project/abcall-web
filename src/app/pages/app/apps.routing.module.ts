import { Routes } from '@angular/router';
import { IssuesComponent } from './issues/issues.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InvoiceListComponent } from './payment/invoice-list/invoice-list.component';

export const AppsRoutes: Routes = [
  {
    path: 'issues',
    component: IssuesComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'invoices',
    component: InvoiceListComponent,
  },
];
