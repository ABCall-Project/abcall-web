

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IssuesService } from './issues.service';
import { environment } from 'src/environments/environment';
import { IIssuesDashboard } from '../models/issue/issues-dashboard';
import { AnswerResponse } from '../models/issue/answerai-response';
import { IssueResponse } from '../models/issue/issue-response';

describe('IssuesService', () => {
  let service: IssuesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IssuesService]
    });
    service = TestBed.inject(IssuesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve an answer based on a question', () => {
    const question = 'What is AI?';
    const mockResponse: AnswerResponse = { answer: 'Artificial Intelligence is...' };

    service.getAnswer(question).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.ApiBase}${environment.getIAResponse}`.replace('{QUESTION}', question));
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should retrieve a predictive AI answer based on user ID', () => {
    const userId = 'user123';
    const mockResponse: AnswerResponse = { answer: 'This is a predictive response.' };

    service.getPredictiveAIAnswer(userId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.ApiBase}${environment.getIAPredictiveAnswer}`.replace('{USER_ID}', userId));
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
  it('should retrieve issues dashboard data', () => {
    const customerId = '123';
    const mockIssues: IIssuesDashboard[] = [
      { status: 'open', channel_plan_id: 'plan-1', created_at: new Date('2024-01-01') },
      { status: 'closed', channel_plan_id: 'plan-2', created_at: new Date('2024-02-01') }
    ];

    service.getIssuesDasboard(customerId).subscribe((issues) => {
      expect(issues.length).toBe(2);
      expect(issues[0].status).toBe('open');
    });

    const req = httpMock.expectOne(
      `${environment.ApiBase}${environment.getIssuesDashboard}`.replace('{CUSTOMER_ID}', customerId)
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockIssues);
  });

  it('should send parameters in the request when provided', () => {
    const customerId = '123';
    const status = 'open';
    const mockIssues: IIssuesDashboard[] = [
      { status: 'open', channel_plan_id: 'plan-1', created_at: new Date('2024-01-01') }
    ];

    service.getIssuesDasboard(customerId, status).subscribe((issues) => {
      expect(issues.length).toBe(1);
      expect(issues[0].status).toBe('open');
    });

    const req = httpMock.expectOne(
      `${environment.ApiBase}${environment.getIssuesDashboard}&status=open`.replace('{CUSTOMER_ID}', customerId)
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.has('status')).toBeTrue();
    expect(req.request.params.get('status')).toBe(status);
    req.flush(mockIssues);
  });

});
