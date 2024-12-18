import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IIssuesDashboard } from '../models/issue/issues-dashboard';
import { AnswerResponse } from '../models/issue/answerai-response';
import { Issue } from '../models/issue/issue';
import { IssueResponse } from '../models/issue/issue-response';
import { IssueList } from '../models/issue/issue-list';

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

  getAll(): Observable<Issue[]> {
    return this.http.get<Issue[]>(`${environment.ApiBase}${environment.getAll}`);
  }

  assignIssue(issueId: string, body: {
    auth_user_agent_id: string
  }): Observable<IssueResponse> {
    return this.http.post<IssueResponse>(`${environment.ApiBase}${environment.assignIssue}${issueId}`, body);
  }

  getOpenIssues(page: number = 1, limit: number = 5): Observable<IssueList> {
    return this.http.get<IssueList>(`${environment.ApiBase}${environment.openIssues}?page=${page}&limit=${limit}`).pipe(
      map(reponse => {
        return reponse;
      }));
  }

  getTopSevenIssues(): Observable<Issue[]>{
    return this.http.get<Issue[]>(`${environment.ApiBase}${environment.topSevenIssues}`);
  }

  getPredictiveData(): Observable<{ realDatabyDay: number[], predictedDatabyDay: number[],realDataIssuesType: number[],predictedDataIssuesType: number[],issueQuantity: number[] }> {
    return this.http.get<{ realDatabyDay: number[], predictedDatabyDay: number[], realDataIssuesType: number[],predictedDataIssuesType: number[],issueQuantity: number[]}>(`${environment.ApiBase}${environment.predictedData}`);
  }
}