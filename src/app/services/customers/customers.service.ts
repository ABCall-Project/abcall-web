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
    return this.http.get<Customer[]>(`${environment.ApiCustomers}${environment.getCustomerList}`);
  }

  getChannelByPlan(planId: string): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${environment.ApiCustomers}${environment.getChannelByPlan}${planId}`);
  }
}
