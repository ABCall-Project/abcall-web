import { RouterTestingModule } from '@angular/router/testing'; 
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatPaginatorModule } from '@angular/material/paginator'; 
import { MatSortModule } from '@angular/material/sort'; 
import { MatTableModule } from '@angular/material/table'; 
import { CommonModule } from '@angular/common'; 
import { TablerIconsModule } from 'angular-tabler-icons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { PaymentService } from '../payment.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { InvoiceListComponent } from './invoice-list.component';
import { IInvoice } from '../../../../models/invoice';
import { IInvoiceDetail } from '../../../../models/invoice-detail';
import { InvoiceDetailListComponent } from '../invoice-detail-list/invoice-detail-list.component';
import { ModalMessageComponent } from '../../modal-message/modal-message.component';


const mockInvoices: IInvoice[] = [
  {
    id: '1',
    invoiceId: 'INV123',
    customerId: '123',
    planId: 'PLAN001',
    amount: 100,
    tax: 10,
    totalAmount: 110,
    status: 'Paid',
    createdAt: new Date('2023-10-01'),
    startAt: new Date('2023-10-01'),
    generationDate: new Date('2023-10-01'),
    endAt: new Date('2023-12-31'),
    planAmount: 100,
    issuesAmount: 5
  },
  {
    id: '2',
    invoiceId: 'INV122',
    customerId: '1232',
    planId: 'PLAN002',
    amount: 100,
    tax: 10,
    totalAmount: 110,
    status: 'Paid',
    createdAt: new Date('2023-10-01'),
    startAt: new Date('2023-10-01'),
    generationDate: new Date('2023-10-01'),
    endAt: new Date('2023-12-31'),
    planAmount: 100,
    issuesAmount: 5
  }
];


const mockTotalCost = 500;

describe('InvoiceListComponent', () => {
  let component: InvoiceListComponent;
  let fixture: ComponentFixture<InvoiceListComponent>;
  let paymentService: PaymentService;
  let dialogSpy: jasmine.Spy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ 
                InvoiceListComponent, 
                RouterTestingModule,   
                MatDialogModule,       
                MatPaginatorModule,   
                MatSortModule,       
                MatTableModule,      
                CommonModule, TablerIconsModule.pick({ eye: 'eye' }) ,
                HttpClientTestingModule ,
                BrowserAnimationsModule 
              ],
      providers: [PaymentService, { provide: MatDialog, useValue: { open: () => {} } }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceListComponent);
    component = fixture.componentInstance;
    paymentService = TestBed.inject(PaymentService);

    dialogSpy = spyOn<any>(TestBed.inject(MatDialog), 'open').and.callFake(() => ({
      afterClosed: () => of(true),
    }));
    
    

    fixture.detectChanges(); 
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should get total cost in getTotalCost', () => {
    spyOn(paymentService, 'getTotalCost').and.returnValue(of(mockTotalCost));

    component.getTotalCost();

    expect(paymentService.getTotalCost).toHaveBeenCalledWith(component.customerId);
    expect(component.totalCost).toEqual(mockTotalCost);
  });

  it('should get invoices and update table data in getInvoices', () => {
    spyOn(paymentService, 'getInvoices').and.returnValue(of(mockInvoices));

    component.getInvoices();

    expect(paymentService.getInvoices).toHaveBeenCalledWith(component.customerId);
    expect(component.invoices).toEqual(mockInvoices);
    expect(component.dataSource.data).toEqual(mockInvoices);
    expect(component.totalRows).toEqual(mockInvoices.length);
  });

  it('should select and deselect row in onCheckboxChange', () => {
    const invoice = mockInvoices[0];

    component.onCheckboxChange(invoice);
    expect(component.selectedRow).toBe(invoice);

    component.onCheckboxChange(invoice);
    expect(component.selectedRow).toBeNull();
  });

  it('should correctly identify if row is selected in isRowSelected', () => {
    const invoice = mockInvoices[0];

    component.selectedRow = invoice;
    expect(component.isRowSelected(invoice)).toBeTrue();

    component.selectedRow = null;
    expect(component.isRowSelected(invoice)).toBeFalse();
  });

  it('should open dialog with invoice details in openInvoiceDetails', () => {
    const invoice = mockInvoices[0];

    component.openInvoiceDetails(invoice);

    expect(dialogSpy).toHaveBeenCalledWith(InvoiceDetailListComponent, {
      data: {
        invoice: invoice.id,
        generationDate: invoice.generationDate
      },
    });
  });

  it('should download the invoice if a row is selected in downloadInvoice', () => {
    const invoiceId = 'INV123';
    const blobMock = new Blob();
    spyOn(paymentService, 'downloadInvoice').and.returnValue(of(blobMock));
    spyOn(window.URL, 'createObjectURL').and.returnValue('blob:url');
    spyOn(document.body, 'appendChild');
    spyOn(document.body, 'removeChild');
    spyOn(window.URL, 'revokeObjectURL');

    component.selectedRow = { invoiceId };
    component.downloadInvoice();

    expect(paymentService.downloadInvoice).toHaveBeenCalledWith(invoiceId);
    expect(document.body.appendChild).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalled();
    expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:url');
  });

  it('should show modal message if no invoice is selected for download in downloadInvoice', () => {
    component.selectedRow = null;

    component.downloadInvoice();

    expect(dialogSpy).toHaveBeenCalledWith(ModalMessageComponent, {
      data: {
        title: 'Facturas',
        message: 'Seleccione una factura para descargar',
        buttonCloseTitle: 'Aceptar'
      },
    });
  });
});
