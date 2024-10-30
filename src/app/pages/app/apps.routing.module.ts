import { Routes } from '@angular/router';
import { IssuesComponent } from './issues/issues.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InvoiceListComponent } from './payment/invoice-list/invoice-list.component';
import { CreateIssueComponent } from './manage-issues/create-issue/create-issue.component';
import { IssueStateComponent } from './issue-state/issue-state.component';
import { KnowledgeBaseComponent } from './knowledge-base/knowledge-base.component';

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
    path: 'issue-state',
    component: IssueStateComponent,
  },
  {
    path: 'knowledge-base',
    component: KnowledgeBaseComponent,
  },
];
