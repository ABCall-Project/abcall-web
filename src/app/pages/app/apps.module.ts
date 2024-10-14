import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IssuesComponent } from './issues/issues.component';
import { MaterialModule } from 'src/app/material.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppsRoutes } from './apps.routing.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule.forChild(AppsRoutes),
    IssuesComponent,
    DashboardComponent
  ],
})
export class AppsModule {}
