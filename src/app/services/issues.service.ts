import { HttpClient, HttpParams } from '@angular/common/http';
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

    const createdAtStr = createdAt ? createdAt.toISOString().split('T')[0] : undefined;
    const closedAtStr = closedAt ? closedAt.toISOString().split('T')[0] : undefined;

    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (channelPlanId) params = params.set('channel_plan_id', channelPlanId);
    if (createdAtStr) params = params.set('created_at', createdAtStr);
    if (closedAtStr) params = params.set('closed_at', closedAtStr);

    return this.http.get<IIssuesDashboard[]>(url, { params })
      .pipe(
        map(response => response)
      );
  }

  createIssue(issue: FormData): Observable<IssueResponse> {
    return this.http.post<IssueResponse>(`http://51.8.255.65:3007${environment.createIssue}`, issue);
  }


  getPredictiveAIAnswer(userId: string): Observable<AnswerResponse> {
    return this.http.get<AnswerResponse>(`${environment.ApiBase}${environment.getIAPredictiveAnswer}`.replace('{USER_ID}', userId));
  }

  getIssueById(issueId: string): Observable<Issue> {
    return this.http.get<Issue>(`http://51.8.255.65:3007${environment.getIssueByid}${issueId}`);
  }

}
