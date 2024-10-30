import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IssuesComponent } from './issues/issues.component';
import { MaterialModule } from 'src/app/material.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppsRoutes } from './apps.routing.module';
import { IssueStateComponent } from './issue-state/issue-state.component';
import { KnowledgeBaseComponent } from './knowledge-base/knowledge-base.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule.forChild(AppsRoutes),
    IssuesComponent,
    DashboardComponent,
    IssueStateComponent,
    KnowledgeBaseComponent
  ],
})
export class AppsModule {}
