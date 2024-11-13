import { Routes } from '@angular/router';
import { IssuesComponent } from './issues/issues.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InvoiceListComponent } from './payment/invoice-list/invoice-list.component';
import { CreateIssueComponent } from './manage-issues/create-issue/create-issue.component';
import { KnowledgeBaseComponent } from './knowledge-base/knowledge-base.component';
import { StarterComponent } from '../starter/starter.component';

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
    path: 'knowledge-base',
    component: KnowledgeBaseComponent,
  },
  {
    path: 'starter',
    component: StarterComponent,
  },
];
