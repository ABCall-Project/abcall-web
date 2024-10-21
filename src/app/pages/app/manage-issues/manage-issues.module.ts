import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateIssueComponent } from './create-issue/create-issue.component';
import { ModalIssueAiAnswerComponent } from './modal-issue-ai-answer/modal-issue-ai-answer.component';



@NgModule({
  declarations: [
    CreateIssueComponent,
    ModalIssueAiAnswerComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ManageIssuesModule { }
