import { Component, Inject, ViewChild,OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';

import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table'; 
import { MatSortModule } from '@angular/material/sort'; 
import { MatPaginatorModule } from '@angular/material/paginator';
import { TablerIconsModule } from 'angular-tabler-icons';

export interface DialogData {
  title:string;
  message:string;
  buttonCloseTitle:string;
}

@Component({
  selector: 'app-modal-message',
  standalone: true,
  templateUrl: './modal-message.component.html',
  styleUrls: ['./modal-message.component.scss'],
  imports: [CommonModule,MatDialogModule, MatButtonModule,MatCardModule,MatTableModule,MatSortModule,TablerIconsModule,MatPaginatorModule] 
})
export class ModalMessageComponent {


  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData){

  }


}
