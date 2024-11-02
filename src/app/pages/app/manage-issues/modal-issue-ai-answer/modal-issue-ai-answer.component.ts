import { Component, Inject, ViewChild, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { IInvoiceDetail } from '../../../../models/invoice-detail';

import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TablerIconsModule } from 'angular-tabler-icons';
import { AnswerResponse } from '../../../../models/issue/answerai-response';
import { IssuesService } from 'src/app/services/issues.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



export interface DialogData {
  question: string;
}
@Component({
  selector: 'app-modal-issue-ai-answer',
  standalone: true,
  templateUrl: './modal-issue-ai-answer.component.html',
  styleUrls: ['./modal-issue-ai-answer.component.scss'],
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatCardModule, MatTableModule, MatSortModule, TablerIconsModule, MatPaginatorModule, MatProgressSpinnerModule]
})
export class ModalIssueAiAnswerComponent implements OnInit {
  answer: string | undefined;
  question: string;
  isLoading: boolean = false;

  constructor(private issuesService: IssuesService, @Inject(MAT_DIALOG_DATA) public data: DialogData) {

  }

  ngOnInit(): void {
    this.question = this.data.question;
    this.getIAAnswer(this.question)
  }


  getIAAnswer(question: string): void {
    this.isLoading = true;
    this.issuesService.getAnswer(question).subscribe(
      (response: AnswerResponse) => {
        this.answer = response.answer;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching answer:', error);
        this.isLoading = false;
      }
    );
  }

}
