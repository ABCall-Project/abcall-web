import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { MaterialModule } from 'src/app/material.module'
import { MatTableModule } from '@angular/material/table'; // Asegúrate de importar esto
import { MatSortModule } from '@angular/material/sort'; // Importa e

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    MatTableModule,
    MatSortModule
  ]
})
export class PaymentModule { }
