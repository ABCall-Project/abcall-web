

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IssuesService } from './issues.service';
import { environment } from 'src/environments/environment';
import { IIssuesDashboard } from '../models/issue/issues-dashboard';
import { AnswerResponse } from '../models/issue/answerai-response';
import { IssueResponse } from '../models/issue/issue-response';
import { IssueList } from '../models/issue/issue-list';

describe('IssuesService', () => {
  let service: IssuesService;
  let httpMock: HttpTestingController;
  const api = 'http://51.8.255.65:3007'

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

  it('Should retrieve an answer based on a question', () => {
    const question = 'What is AI?';
    const mockResponse: AnswerResponse = { answer: 'Artificial Intelligence is...' };

    service.getAnswer(question).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.ApiBase}${environment.getIAResponse}`.replace('{QUESTION}', question));
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('Should retrieve a predictive AI answer based on user ID', () => {
    const userId = 'user123';
    const mockResponse: AnswerResponse = { answer: 'This is a predictive response.' };

    service.getPredictiveAIAnswer(userId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.ApiBase}${environment.getIAPredictiveAnswer}`.replace('{USER_ID}', userId));
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
  it('Should retrieve issues dashboard data', () => {
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

  it('Should send parameters in the request when provided', () => {
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

  it('Should send parameters with date and channel id filter', () => {
    const customerId = '123';
    const status = 'open';
    const channelId = 'mock-channel-id';
    const createdAt = new Date('2024-01-01');
    const closedAt = new Date('2024-02-01');
    const mockIssues: IIssuesDashboard[] = [
      { status: 'open', channel_plan_id: 'plan-1', created_at: new Date('2024-01-01') }
    ];

    service.getIssuesDasboard(customerId, status, channelId, createdAt, closedAt).subscribe((issues) => {
      expect(issues.length).toBe(1);
      expect(issues[0].status).toBe('open');
    });

    const req = httpMock.expectOne(
      `${environment.ApiBase}${environment.getIssuesDashboard}&status=${status}&channel_plan_id=${channelId}&created_at=${createdAt.toISOString().split('T')[0]}&closed_at=${closedAt.toISOString().split('T')[0]}`.replace('{CUSTOMER_ID}', customerId)
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.has('status')).toBeTrue();
    expect(req.request.params.get('status')).toBe(status);
    req.flush(mockIssues);
  });

  it('Should create an issue and return the response', () => {
    const issueData = new FormData();
    const expectedMessage = 'mock message';
    const mockIssueResponse: IssueResponse = { message: expectedMessage };

    service.createIssue(issueData).subscribe((response) => {
      expect(response.message).toBe(expectedMessage);
    });

    const req = httpMock.expectOne(`${api}${environment.createIssue}`);
    expect(req.request.method).toBe('POST');
    req.flush(mockIssueResponse);
  });



  it('Should retrieve open issues with correct parameters', () => {
    const page = 1;
    const limit = 5;

    const mockResponse: IssueList = {
      page: page,
      limit: limit,
      totalPages: 1,
      has_next: false,
      data: [
        {
          "id": "7c039d27-82c7-4bbc-9054-d242af4d55d5",
          "authUserId": "e8b8a5d2-0f71-4e4d-b6e3-9c9d64f9cdda",
          "status": "Created",
          "subject": "Incidente por chatbot",
          "description": "Tengo problemas con el internet ",
          "createdAt": "2024-10-24 17:25:33.407560+00:00",
          "closedAt": "2024-10-24 17:25:33.429142+00:00",
          "channelPlanId": "None"
        }
      ]
    };

    service.getOpenIssues(page, limit).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${environment.ApiBase}${environment.openIssues}?page=${page}&limit=${limit}`
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });


});
