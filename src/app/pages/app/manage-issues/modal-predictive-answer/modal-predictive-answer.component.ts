import { Component, Inject, ViewChild,OnInit,Pipe, PipeTransform } from '@angular/core';
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
import { AnswerResponse } from '../../../../models/answerai-response';
import { IssuesService } from 'src/app/services/issues.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../../../environments/environment';
import { Nl2brPipe } from '../../../../pipe/nl2br.pipe';

export interface DialogData {
  question: string;
}


@Component({
  selector: 'app-modal-predictive-answer',
  standalone:true,
  templateUrl: './modal-predictive-answer.component.html',
  styleUrls: ['./modal-predictive-answer.component.scss'],
  imports: [CommonModule,MatDialogModule, MatButtonModule,MatCardModule,MatTableModule,MatSortModule,TablerIconsModule,MatPaginatorModule,MatProgressSpinnerModule,Nl2brPipe] 
})
export class ModalPredictiveAnswerComponent {
  answer: string ='';
  isLoading: boolean = false;
  userId!: string;

  constructor(private issuesService: IssuesService,@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    const encryptionKey = environment.key;
    const encryptedData = sessionStorage.getItem('ref');

    if (encryptedData) {
      const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      this.userId=decryptedData.userId;
    }
  }

  ngOnInit(): void {

    this.getPredictiveIAAnswer(this.userId)
  }

  getPredictiveIAAnswer(userId:string): void {
    this.isLoading = true;
    this.issuesService.getPredictiveAIAnswer(userId).subscribe(
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