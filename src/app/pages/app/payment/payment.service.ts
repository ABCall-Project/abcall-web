import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { IInvoice } from '../models/invoice';
import { ITotalCostResponse } from  '../models/total-cost';
import { Observable } from 'rxjs';
import { IInvoiceDetail } from '../models/invoice-detail';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(private readonly http:HttpClient) { }

  getInvoices(customerId:string){
    const url=`${environment.ApiBase}${environment.getInvoices}`.replace('{CUSTOMER_ID}',customerId);
    return this.http.get<IInvoice[]>(url)
    .pipe(
      map(reponse => {
        return reponse;
      }));
  }

  getTotalCost(customerId: string): Observable<number> {
    const url = `${environment.ApiBase}${environment.getTotalCostPending}`.replace('{CUSTOMER_ID}',customerId);
    return this.http.get<ITotalCostResponse>(url)  
      .pipe(
        map(response => response.total_cost)  
      );
  }

  getInvoiceDetails(invoiceId: string): Observable<IInvoiceDetail[]> {
    const url = `${environment.ApiBase}${environment.getListDetailsInvoiceById}`.replace('{INVOICE_ID}',invoiceId);

    return this.http.get<IInvoiceDetail[]>(url)  
      .pipe(
        map(response => response)  
      );
  }
}
