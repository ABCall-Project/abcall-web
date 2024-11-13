import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { AppSideLoginComponent } from './pages/authentication/side-login/side-login.component';
import { IssuesComponent } from './pages/app/issues/issues.component';
import { DashboardComponent } from './pages/app/dashboard/dashboard.component';
import { InvoiceListComponent } from './pages/app/payment/invoice-list/invoice-list.component';
import { CreateIssueComponent } from './pages/app/manage-issues/create-issue/create-issue.component';
import { KnowledgeBaseComponent } from './pages/app/knowledge-base/knowledge-base.component';
import { StarterComponent } from './pages/starter/starter.component';


const routes: Routes = [
  {
    path: '',
    component: AppSideLoginComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.module').then(
            (m) => m.AuthenticationModule
          ),
      },
    ],
  },
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
