import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PaymentService } from './payment.service';
import { environment } from '../../../../environments/environment';
import { IInvoice } from '../../../models/invoice';
import { ITotalCostResponse } from '../../../models/total-cost';
import { IInvoiceDetail } from '../../../models/invoice-detail';

describe('PaymentService', () => {
  let service: PaymentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PaymentService]
    });

    service = TestBed.inject(PaymentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get invoices for a customer', () => {

    const mockInvoices: IInvoice[] = [{
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
    }];
    const customerId = '123';
    const url = `${environment.ApiBase}${environment.getInvoices}`.replace('{CUSTOMER_ID}', customerId);

    service.getInvoices(customerId).subscribe(invoices => {
      expect(invoices.length).toBe(1);
      expect(invoices).toEqual(mockInvoices);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockInvoices);
  });

  it('should get total cost for a customer', () => {
    const mockTotalCost: ITotalCostResponse = { total_cost: 500 };
    const customerId = '123';
    const url = `${environment.ApiBase}${environment.getTotalCostPending}`.replace('{CUSTOMER_ID}', customerId);

    service.getTotalCost(customerId).subscribe(totalCost => {
      expect(totalCost).toBe(500);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockTotalCost);
  });

  it('should get invoice details by invoice ID', () => {
    const mockInvoiceDetails: IInvoiceDetail[] = [{
      id: '1',
      detail: 'Test Item',
      amount: 100,
      tax: 10,
      totalAmount: 110,
      issueId: 'ISSUE001',
      chanelPlanId: 'CHPLAN001',
      invoiceId: 'INV123',
      issueDate: new Date('2023-10-01')
    }];
    const invoiceId = '123';
    const url = `${environment.ApiBase}${environment.getListDetailsInvoiceById}`.replace('{INVOICE_ID}', invoiceId);

    service.getInvoiceDetails(invoiceId).subscribe(details => {
      expect(details.length).toBe(1);
      expect(details).toEqual(mockInvoiceDetails);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockInvoiceDetails);
  });

  it('should download an invoice', () => {
    const invoiceNumber = 'INV123';
    const mockBlob = new Blob(['Test Invoice'], { type: 'application/pdf' });
    const url = `${environment.ApiBase}${environment.downloadInvoice}`.replace('{INVOICE_NUMBER}', invoiceNumber);

    service.downloadInvoice(invoiceNumber).subscribe(blob => {
      expect(blob).toEqual(mockBlob);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
    req.flush(mockBlob);
  });
});
