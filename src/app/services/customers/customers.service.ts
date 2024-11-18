import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from 'src/app/models/customer/customer';
import { environment } from 'src/environments/environment';
import { Channel } from 'src/app/models/channel/channel';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(private readonly http: HttpClient) { }
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${environment.ApiBase}${environment.getCustomerList}`);
  }

  getChannelByPlan(planId: string): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${environment.ApiBase}${environment.getChannelByPlan}${planId}`);
  }

  loadCustomerDatabaseEntries(customerId: string, entries: { topic: string; content: string }[]): Observable<any> {
    const customerBase = { customer_id: customerId, entries };
    return this.http.post<any>(`${environment.ApiBase}/customer/loadCustomerDataBase`, customerBase);
  }

  addCustomers(planId: string, customers: { document: string; name: string }[]): Observable<any> {
    const loadCustomers = { plan_id: planId, customers };
    return this.http.post<any>(`${environment.ApiBase}/customer/loadCustomers`, loadCustomers);
  }
}
