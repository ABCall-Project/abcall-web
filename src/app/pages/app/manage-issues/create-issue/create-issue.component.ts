import { Component,OnInit,AfterViewInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { IInvoice } from '../../../../models/invoice';
import { MatTableModule } from '@angular/material/table'; 
import { MatSortModule } from '@angular/material/sort'; 
import { RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormControl } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { ReactiveFormsModule } from '@angular/forms';



import { ModalMessageComponent } from '../../modal-message/modal-message.component';
import { ModalIssueAiAnswerComponent } from '../modal-issue-ai-answer/modal-issue-ai-answer.component';

@Component({
  selector: 'app-create-issue',
  standalone: true,
  templateUrl: './create-issue.component.html',
  styleUrls: ['./create-issue.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    RouterModule,
    TablerIconsModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule
  ]
})
export class CreateIssueComponent {

  descripcion = new FormControl('');


  constructor(public dialog: MatDialog){

  }


  openModalIAAnswer() {
    const valorDescripcion = this.descripcion.value;
    console.log(valorDescripcion)

    if (valorDescripcion && valorDescripcion.trim() !== '') {
      this.dialog.open(ModalIssueAiAnswerComponent, {
        data: {
          question: valorDescripcion,
        },
      });
    }
    else{
      this.openModalErrorDescriptionEmpty();
    }
  }

  openModalErrorDescriptionEmpty() {
   
    this.dialog.open(ModalMessageComponent, {
      data: {
        title:'Incidentes',
        message:'Debe ingresar una descripción para continuar',
        buttonCloseTitle:'Aceptar'
      },
    });
  }
}
