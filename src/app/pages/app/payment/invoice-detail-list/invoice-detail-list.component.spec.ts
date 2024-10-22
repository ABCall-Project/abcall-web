import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentService } from '../payment.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { InvoiceDetailListComponent } from './invoice-detail-list.component';
import { IInvoiceDetail } from '../../../../models/invoice-detail';
import { TablerIconsModule } from 'angular-tabler-icons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


const mockInvoiceDetails: IInvoiceDetail[] = [
  {
    id: '1',
    detail: 'Test Item 1',
    amount: 100,
    tax: 10,
    totalAmount: 110,
    issueId: 'ISSUE001',
    chanelPlanId: 'CHPLAN001',
    invoiceId: 'INV123',
    issueDate: new Date('2023-10-01')
  },
  {
    id: '2',
    detail: 'Test Item 2',
    amount: 200,
    tax: 20,
    totalAmount: 220,
    issueId: 'ISSUE002',
    chanelPlanId: 'CHPLAN002',
    invoiceId: 'INV124',
    issueDate: new Date('2023-10-02')
  }
];


const mockDialogData = {
  invoice: 'INV123',
  generationDate: new Date('2023-10-01')
};

describe('InvoiceDetailListComponent', () => {
  let component: InvoiceDetailListComponent;
  let fixture: ComponentFixture<InvoiceDetailListComponent>;
  let paymentService: PaymentService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, 
        InvoiceDetailListComponent,
        TablerIconsModule.pick({ eye: 'eye' }),
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatDialogRef, useValue: {} }, 
        PaymentService 
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceDetailListComponent);
    component = fixture.componentInstance;
    paymentService = TestBed.inject(PaymentService);

    spyOn(paymentService, 'getInvoiceDetails').and.returnValue(of(mockInvoiceDetails));

    fixture.detectChanges(); 
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getInvoiceDetails and update the table data and totalRows', () => {
    
    component.getInvoiceDetails();

    
    expect(paymentService.getInvoiceDetails).toHaveBeenCalledWith('INV123');

    
    expect(component.invoiceDetails.length).toBe(2);
    expect(component.dataSource.data).toEqual(mockInvoiceDetails);

    
    expect(component.totalRows).toBe(2);
  });
});
