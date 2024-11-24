import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IssuesComponent } from './issues/issues.component';
import { MaterialModule } from 'src/app/material.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppsRoutes } from './apps.routing.module';
import { MatIconModule } from '@angular/material/icon';
import { KnowledgeBaseComponent } from './knowledge-base/knowledge-base.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { ClientListComponent } from './client/client-list/client-list.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule.forChild(AppsRoutes),
    IssuesComponent,
    DashboardComponent,
    ClientListComponent,
    CommonModule,
    MaterialModule,
    MatTableModule,
    MatSortModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppsModule { }
