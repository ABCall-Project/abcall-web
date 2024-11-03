import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateIssueComponent } from './create-issue/create-issue.component';
import { ModalIssueAiAnswerComponent } from './modal-issue-ai-answer/modal-issue-ai-answer.component';
import { MatIconModule } from '@angular/material/icon';import { ModalPredictiveAnswerComponent } from './modal-predictive-answer/modal-predictive-answer.component';
import { Nl2brPipe } from './modal-predictive-answer/nl2br.pipe';



@NgModule({
  declarations: [
    CreateIssueComponent,
    ModalIssueAiAnswerComponent,
    MatIconModule,
    ModalPredictiveAnswerComponent,
    Nl2brPipe
  ],
  imports: [
    CommonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ManageIssuesModule { }
