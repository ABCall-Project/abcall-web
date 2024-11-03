import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IIssuesDashboard } from '../models/issue/issues-dashboard';
import { AnswerResponse } from '../models/issue/answerai-response';
import { Issue } from '../models/issue/issue';
import { IssueResponse } from '../models/issue/issue-response';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {
  constructor(private readonly http: HttpClient) { }

  getAnswer(question: string): Observable<AnswerResponse> {
    return this.http.get<AnswerResponse>(`${environment.ApiBase}${environment.getIAResponse}`.replace('{QUESTION}', question));
  }

  getIssuesDasboard(customerId: string, status?: string, channelPlanId?: string, createdAt?: Date, closedAt?: Date) {
    const url = `${environment.ApiBase}${environment.getIssuesDashboard}`.replace('{CUSTOMER_ID}', customerId);
    return this.http.get<IIssuesDashboard[]>(url)
      .pipe(
        map(reponse => {
          return reponse;
        }));
  }

  createIssue(issue: FormData): Observable<IssueResponse> {
    return this.http.post<IssueResponse>(`${environment.ApiBase}${environment.createIssue}`, issue);
  }


  getPredictiveAIAnswer(userId:string): Observable<AnswerResponse> {
    return this.http.get<AnswerResponse>(`${environment.ApiBase}${environment.getIAPredictiveAnswer}`.replace('{USER_ID}',userId));
  }
}
