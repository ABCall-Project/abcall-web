import { Component, Inject, ViewChild,OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { PaymentService } from '../payment.service';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface DialogData {
  invoice: string;
  generationDate:Date
}

@Component({
  selector: 'app-invoice-detail-list',
  standalone: true,
  templateUrl: './invoice-detail-list.component.html',
  styleUrls: ['./invoice-detail-list.component.scss'],
  imports: [CommonModule,MatDialogModule, MatButtonModule,MatCardModule,MatTableModule,MatSortModule,TablerIconsModule,MatPaginatorModule,MatProgressSpinnerModule] 

})
export class InvoiceDetailListComponent implements OnInit {

  invoiceId:string;
  invoiceDetails: Array<IInvoiceDetail> = [];
  dataSource = new MatTableDataSource(this.invoiceDetails);
  totalRows: number | undefined;
  displayedColumns: string[] = ['fecha','descripcion','hora','costo'];
  isLoading: boolean = false;
  

  constructor(private readonly paymentService:PaymentService,@Inject(MAT_DIALOG_DATA) public data: DialogData){
  }
  ngOnInit(): void {
    this.invoiceId=this.data.invoice;
    this.getInvoiceDetails();
  }

  getInvoiceDetails(){
    this.isLoading=true;
    this.paymentService.getInvoiceDetails(this.invoiceId).subscribe(invoiceDetails => {
      this.invoiceDetails = invoiceDetails; 
      this.dataSource.data = this.invoiceDetails;
      this.totalRows = this.invoiceDetails.length;
      this.isLoading=false;
    });
  }
}
