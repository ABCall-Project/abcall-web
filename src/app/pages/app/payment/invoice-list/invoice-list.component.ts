import { Component,OnInit,AfterViewInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PaymentService } from '../payment.service';
import { CommonModule } from '@angular/common';
import { IInvoice } from '../../../../models/invoice';
import { MatTableModule } from '@angular/material/table'; 
import { MatSortModule } from '@angular/material/sort'; 
import { RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatPaginatorModule } from '@angular/material/paginator';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { InvoiceDetailListComponent } from '../invoice-detail-list/invoice-detail-list.component';
import { ModalMessageComponent } from '../../modal-message/modal-message.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
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
    MatProgressSpinnerModule
  ]
})
export class InvoiceListComponent implements OnInit {
  
  customerId:string;
  totalCost:number;
  invoices: Array<IInvoice> = [];
  dataSource = new MatTableDataSource(this.invoices);
  displayedColumns: string[] = ['chk','invoiceId','generationDate','amount','costByIssues', 'actions'];
  totalRows: number | undefined;
  selectedRow: any; 
  isLoading: boolean = false;
  isLoadingCost: boolean = false;
  isDownloading: boolean=false;


  constructor(private readonly paymentService:PaymentService,public dialog: MatDialog){
    this.customerId='845eb227-5356-4169-9799-95a97ec5ce33';
  }
  
  ngOnInit(): void {
    this.getTotalCost();
    this.getInvoices();
  }

  getTotalCost(){
    this.isLoadingCost=true;
    this.paymentService.getTotalCost(this.customerId).subscribe(totalCost => {
      this.totalCost=totalCost;
      this.isLoadingCost=false;
    });
  }

  getInvoices(){
    this.isLoading = true;
    this.paymentService.getInvoices(this.customerId).subscribe(invoices => {
      this.invoices = invoices; 
      this.dataSource.data = this.invoices;
      this.totalRows = this.invoices.length;
      this.isLoading = false;
    });
  }
  
  onCheckboxChange(element: any) {
    if (this.selectedRow === element) {
      this.selectedRow = null;
    } else {
      this.selectedRow = element; 
    }
  }

  isRowSelected(element: any): boolean {
    return this.selectedRow === element; 
  }

  openInvoiceDetails(element: any) {
   
    this.dialog.open(InvoiceDetailListComponent, {
      data: {
        invoice: element.id,
        generationDate: element.generationDate
      },
    });
  }


  downloadInvoice() {
    this.isDownloading=true;
    if (this.selectedRow && this.selectedRow.invoiceId) {
      this.paymentService.downloadInvoice(this.selectedRow.invoiceId).subscribe((response: Blob) => {
        const url = window.URL.createObjectURL(response); 
        const a = document.createElement('a');           
        a.href = url;
        a.download = `invoice-${this.selectedRow.invoiceId}.pdf`;         
        document.body.appendChild(a);
        a.click();                                       
        document.body.removeChild(a);                  
        window.URL.revokeObjectURL(url); 
        this.isDownloading=false;             
      });
    }
    else{
      this.openModalMessageDontSelectedRow();
      this.isDownloading=false;       
    }
  }

  openModalMessageDontSelectedRow() {
   
    this.dialog.open(ModalMessageComponent, {
      data: {
        title:'Facturas',
        message:'Seleccione una factura para descargar',
        buttonCloseTitle:'Aceptar'
      },
    });
  }

}
