import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { IInvoiceDetail } from '../models/invoice-detail';
import { AnswerResponse } from '../models/answerai-response';


@Injectable({
  providedIn: 'root'
})
export class IssuesService {

  constructor(private http: HttpClient) {}

  getAnswer(question:string): Observable<AnswerResponse> {
    return this.http.get<AnswerResponse>(`${environment.ApiBase}${environment.getIAResponse}`.replace('{QUESTION}',question));
  }
}



