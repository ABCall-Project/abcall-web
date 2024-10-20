import { Component,OnInit,AfterViewInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PaymentService } from '../payment.service';
import { CommonModule } from '@angular/common';
import { IInvoice } from '../../models/invoice';
import { MatTableModule } from '@angular/material/table'; 
import { MatSortModule } from '@angular/material/sort'; 
import { RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatPaginatorModule } from '@angular/material/paginator';
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
    MatPaginatorModule
  ]
})
export class InvoiceListComponent implements OnInit,AfterViewInit {
  
  customerId:string;
  totalCost:number;
  invoices: Array<IInvoice> = [];
  dataSource = new MatTableDataSource(this.invoices);
  displayedColumns: string[] = ['chk','invoiceId','generationDate','amount','costByIssues', 'actions'];
  totalRows: number | undefined;
  selectedRow: any; 


  constructor(private readonly paymentService:PaymentService){
    this.customerId='845eb227-5356-4169-9799-95a97ec5ce33';
  }
  ngAfterViewInit(): void {
    
  }

  ngOnInit(): void {
    this.getTotalCost();
    this.getInvoices();
  }

  getTotalCost(){
    this.paymentService.getTotalCost(this.customerId).subscribe(totalCost => {
      this.totalCost=totalCost;
      console.log('Total cost:', totalCost);
    });
  }

  getInvoices(){
    this.paymentService.getInvoices(this.customerId).subscribe(invoices => {
      console.log(invoices); 
      this.invoices = invoices; 
      this.dataSource.data = this.invoices;
      this.totalRows = this.invoices.length;
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

}
