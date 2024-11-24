import { Routes } from '@angular/router';
import { IssuesComponent } from './issues/issues.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InvoiceListComponent } from './payment/invoice-list/invoice-list.component';
import { CreateIssueComponent } from './manage-issues/create-issue/create-issue.component';
import { KnowledgeBaseComponent } from './knowledge-base/knowledge-base.component';
import { AssignIssueComponent } from './manage-issues/assign-issue/assign-issue/assign-issue.component';
import { StarterComponent } from '../starter/starter.component';
import { ClientListComponent } from './client/client-list/client-list.component';
import { OpenIssueListComponent } from './manage-issues/open-issue-list/open-issue-list.component';
import { PredictiveDashboardComponent } from './predictive-dashboard/predictive-dashboard/predictive-dashboard.component';

import { LoadCustomersComponent } from './load-customers/load-customers.component';

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
  {
    path: 'new-issue',
    component: CreateIssueComponent,
  },
  {
    path: 'assign-issue',
    component: AssignIssueComponent,
  },
  {
    path: 'knowledge-base',
    component: KnowledgeBaseComponent,
  },
  {
    path: 'starter',
    component: StarterComponent,
  },
  {
    path: 'open-issue',
    component: OpenIssueListComponent,
  },
  {
    path: 'predictive-dashboard',
    component: PredictiveDashboardComponent,
  },
];
