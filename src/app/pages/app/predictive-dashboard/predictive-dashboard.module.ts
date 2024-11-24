import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PredictiveDashboardComponent } from './predictive-dashboard/predictive-dashboard.component';



@NgModule({
  declarations: [
    DashboardComponent,
    PredictiveDashboardComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PredictiveDashboardModule { }
