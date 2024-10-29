import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateIssueComponent } from './create-issue/create-issue.component';
import { ModalIssueAiAnswerComponent } from './modal-issue-ai-answer/modal-issue-ai-answer.component';
import { ModalPredictiveAnswerComponent } from './modal-predictive-answer/modal-predictive-answer.component';



@NgModule({
  declarations: [
    CreateIssueComponent,
    ModalIssueAiAnswerComponent,
    ModalPredictiveAnswerComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ManageIssuesModule { }
