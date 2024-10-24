import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IIssuesDashboard } from '../models/issues-dashboard';
import { AnswerResponse } from '../models/answerai-response';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {
  constructor(private readonly http:HttpClient) { }

  getAnswer(question:string): Observable<AnswerResponse> {
    return this.http.get<AnswerResponse>(`${environment.ApiBase}${environment.getIAResponse}`.replace('{QUESTION}',question));
  }

  getIssuesDasboard(customerId:string, status?:string, channelPlanId?:string, createdAt?:Date, closedAt?:Date){
    const url=`${environment.ApiBase}${environment.getIssuesDashboard}`.replace('{CUSTOMER_ID}',customerId);
    console.log('el environment ');
    console.log(environment);
    return this.http.get<IIssuesDashboard[]>(url)
    .pipe(
      map(reponse => {
        return reponse;
      }));
  }  
}
