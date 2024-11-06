import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CustomersService } from './customers.service';
import { Customer } from 'src/app/models/customer/customer';
import { Channel } from 'src/app/models/channel/channel';
import { environment } from 'src/environments/environment';

describe('CustomersService', () => {
  let service: CustomersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CustomersService]
    });
    service = TestBed.inject(CustomersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve customers from the API via GET', () => {
    const mockCustomers: Customer[] = [
      { id: '1', name: 'Customer1', plan_id: 'plan123', date_suscription: '2023-01-01' },
      { id: '2', name: 'Customer2', plan_id: 'plan456', date_suscription: '2023-02-01' }
    ];

    service.getCustomers().subscribe(customers => {
      expect(customers.length).toBe(2);
      expect(customers).toEqual(mockCustomers);
    });

    const req = httpMock.expectOne(`${environment.ApiBase}${environment.getCustomerList}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCustomers);
  });

  it('should retrieve channels for a specific plan from the API via GET', () => {
    const planId = '123';
    const mockChannels: Channel[] = [
      { id: '1', name: 'Channel1' },
      { id: '2', name: 'Channel2' }
    ];

    service.getChannelByPlan(planId).subscribe(channels => {
      expect(channels.length).toBe(2);
      expect(channels).toEqual(mockChannels);
    });

    const req = httpMock.expectOne(`${environment.ApiBase}${environment.getChannelByPlan}${planId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockChannels);
  });
});
