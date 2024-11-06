import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { IssuesService } from 'src/app/services/issues.service';
import { of } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IIssuesDashboard } from 'src/app/models/issue/issues-dashboard';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { Chart } from 'chart.js';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let issuesService: jasmine.SpyObj<IssuesService>;

  beforeEach(async () => {
    const issuesServiceSpy = jasmine.createSpyObj('IssuesService', ['getIssuesDasboard']);

    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: IssuesService, useValue: issuesServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    issuesService = TestBed.inject(IssuesService) as jasmine.SpyObj<IssuesService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and load issues data on ngOnInit', () => {
    const mockIssues: IIssuesDashboard[] = [
      { status: component.createdId, channel_plan_id: component.callId, created_at: new Date('2024-01-01') },
      { status: component.closedId, channel_plan_id: component.mailId, created_at: new Date('2024-01-02') },
      { status: component.inProgressId, channel_plan_id: component.chatboId, created_at: new Date('2024-01-03') }
    ];

    issuesService.getIssuesDasboard.and.returnValue(of(mockIssues));

    issuesService.getIssuesDasboard.and.returnValue(of(mockIssues));
    component.ngOnInit();

    expect(issuesService.getIssuesDasboard).toHaveBeenCalledWith(component.customerId);
    expect(component.totalCreated).toBe(1);
    expect(component.totalClosed).toBe(1);
    expect(component.totalInProgress).toBe(1);
    expect(component.totalIssues).toBe(3);
    expect(component.totalCalls).toBe(1);
    expect(component.totalMails).toBe(1);
    expect(component.totalChatbot).toBe(1);
  });

  it('should update state when onSelectionState is called', () => {
    const mockEvent = { value: component.createdId };
    const mockIssues: IIssuesDashboard[] = [
      { status: component.createdId, channel_plan_id: component.callId, created_at: new Date('2024-01-01') },
      { status: component.closedId, channel_plan_id: component.mailId, created_at: new Date('2024-01-02') },
      { status: component.inProgressId, channel_plan_id: component.chatboId, created_at: new Date('2024-01-03') }
    ];

    issuesService.getIssuesDasboard.and.returnValue(of(mockIssues));

    issuesService.getIssuesDasboard.and.returnValue(of(mockIssues));
    component.OnSelectionState(mockEvent as any);

    expect(component.selectedState).toBe(component.createdId);
    expect(issuesService.getIssuesDasboard).toHaveBeenCalledWith(component.customerId);
  });

  it('should update origin when onSelectionChange is called', () => {
    const mockEvent = { value: component.callId };
    const mockIssues: IIssuesDashboard[] = [
      { status: component.createdId, channel_plan_id: component.callId, created_at: new Date('2024-01-01') },
      { status: component.closedId, channel_plan_id: component.mailId, created_at: new Date('2024-01-02') },
      { status: component.inProgressId, channel_plan_id: component.chatboId, created_at: new Date('2024-01-03') }
    ];

    issuesService.getIssuesDasboard.and.returnValue(of(mockIssues));

    issuesService.getIssuesDasboard.and.returnValue(of(mockIssues));
    component.OnSelectionChange(mockEvent as any);

    expect(component.selectedOrigen).toBe(component.callId);
    expect(issuesService.getIssuesDasboard).toHaveBeenCalledWith(component.customerId);
  });

  it('should update date range when onDateChange is called', () => {
    const mockIssues: IIssuesDashboard[] = [
      { status: component.createdId, channel_plan_id: component.callId, created_at: new Date('2024-01-01') },
      { status: component.closedId, channel_plan_id: component.mailId, created_at: new Date('2024-01-02') },
      { status: component.inProgressId, channel_plan_id: component.chatboId, created_at: new Date('2024-01-03') }
    ];

    issuesService.getIssuesDasboard.and.returnValue(of(mockIssues));

    component.dateForm.setValue({ startDate: '2024-01-01', endDate: '2024-12-31' });
    issuesService.getIssuesDasboard.and.returnValue(of(mockIssues));

    component.onDateChange();

    expect(issuesService.getIssuesDasboard).toHaveBeenCalledWith(component.customerId, undefined, undefined, new Date('2024-01-01'), new Date('2024-12-31'));
  });

  it('should reset form and selected fields when resetForm is called', () => {
    component.dateForm.setValue({ startDate: '2024-01-01', endDate: '2024-12-31' });
    component.selectedState = component.createdId;
    component.selectedOrigen = component.callId;

    component.resetForm();

    expect(component.dateForm.value).toEqual({ startDate: null, endDate: null });
    expect(component.selectedState).toBeNull();
    expect(component.selectedOrigen).toBeNull();
  });

  it('should create a chart in createEstadoCasosChart method', () => {
    const ctxSpy = spyOn(document, 'getElementById').and.returnValue(document.createElement('canvas'));
    const mockIssues = [
      { status: component.createdId, created_at: '2024-01-01' },
      { status: component.closedId, created_at: '2024-01-02' }
    ];

    component.createEstadoCasosChart(mockIssues);

    expect(ctxSpy).toHaveBeenCalledWith('estadoCasosChart');
  });

  it('should create a chart in createVariacionMensualChart method', () => {
    const ctxSpy = spyOn(document, 'getElementById').and.returnValue(document.createElement('canvas'));
    const mockIssues = [
      { status: component.createdId, created_at: '2024-01-01' },
      { status: component.closedId, created_at: '2024-01-02' }
    ];

    component.createVariacionMensualChart(mockIssues);

    expect(ctxSpy).toHaveBeenCalledWith('variacionMensualChart');
  });

  it('should create a chart in createDistribucionCanalChart method', () => {
    const ctxSpy = spyOn(document, 'getElementById').and.returnValue(document.createElement('canvas'));
    const mockIssues = [
      { channel_plan_id: component.callId, created_at: '2024-01-01' },
      { channel_plan_id: component.mailId, created_at: '2024-01-02' }
    ];

    component.createDistribucionCanalChart(mockIssues);

    expect(ctxSpy).toHaveBeenCalledWith('distribucionCanalChart');
  });

  it('should create a chart in createEvolucionAcumuladaChart method', () => {
    const ctxSpy = spyOn(document, 'getElementById').and.returnValue(document.createElement('canvas'));
    const mockIssues = [
      { channel_plan_id: component.callId, created_at: '2024-01-01' },
      { channel_plan_id: component.mailId, created_at: '2024-01-02' }
    ];

    component.createEvolucionAcumuladaChart(mockIssues);

    expect(ctxSpy).toHaveBeenCalledWith('evolucionAcumuladaChart');
  });

  it('should filter issues correctly based on initial and end dates in createEstadoCasosChart', () => {
    const mockIssues = [
      { status: component.createdId, created_at: new Date('2024-01-01') },
      { status: component.closedId, created_at: new Date('2024-02-01') },
      { status: component.inProgressId, created_at: new Date('2024-03-01') }
    ];

    component.initialDate = new Date('2024-01-01');
    component.endDate = new Date('2024-02-28');

    component.createEstadoCasosChart(mockIssues);

    expect(component.totalCreated).toBe(1);
    expect(component.totalClosed).toBe(1);
    expect(component.totalInProgress).toBe(0);
  });

  it('should handle an unexpected state in OnSelectionState', () => {
    const mockEvent = { value: 'unexpectedState' };
    const mockIssues = [
      { status: component.createdId, channel_plan_id: component.callId, created_at: new Date('2024-01-01') }
    ];

    issuesService.getIssuesDasboard.and.returnValue(of(mockIssues));
    component.OnSelectionState(mockEvent as any);

    expect(component.selectedState).toBe('unexpectedState');
    expect(issuesService.getIssuesDasboard).toHaveBeenCalledWith(component.customerId);
  });

  it('should handle null start or end date in onDateChange', () => {
    component.dateForm.setValue({ startDate: null, endDate: '2024-12-31' });
    const mockIssues = [
      { status: component.createdId, channel_plan_id: component.callId, created_at: new Date('2024-01-01') }
    ];
    issuesService.getIssuesDasboard.and.returnValue(of(mockIssues));

    component.onDateChange();

    expect(issuesService.getIssuesDasboard).toHaveBeenCalledWith(
      component.customerId,
      undefined,
      undefined,
      undefined,
      new Date('2024-12-31')
    );
  });

  it('should decrypt and set customerId from sessionStorage if present', () => {
    const mockData = { customerId: '12345' };
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(mockData), environment.key).toString();
    sessionStorage.setItem('ref', encryptedData);

    const newFixture = TestBed.createComponent(DashboardComponent);
    const newComponent = newFixture.componentInstance;

    expect(newComponent.customerId).toBe('12345');
  });

  it('should not set customerId if sessionStorage ref is missing', () => {
    sessionStorage.removeItem('ref');

    const newFixture = TestBed.createComponent(DashboardComponent);
    const newComponent = newFixture.componentInstance;

    expect(newComponent.customerId).toBeUndefined();
  });

  it('should reset form and selected fields when resetForm is called', () => {
    component.dateForm.setValue({ startDate: '2024-01-01', endDate: '2024-12-31' });
    component.selectedState = component.createdId;
    component.selectedOrigen = component.callId;

    component.resetForm();

    expect(component.dateForm.value).toEqual({ startDate: null, endDate: null });
    expect(component.selectedState).toBeNull();
    expect(component.selectedOrigen).toBeNull();
  });

  it('should call getIssuesDasboard with correct date range when onDateChange is called', () => {
    component.dateForm.setValue({ startDate: '2024-01-01', endDate: '2024-12-31' });
    const mockIssues = [
      { status: component.createdId, channel_plan_id: component.callId, created_at: new Date('2024-01-01') }
    ];
    issuesService.getIssuesDasboard.and.returnValue(of(mockIssues));

    component.onDateChange();

    expect(issuesService.getIssuesDasboard).toHaveBeenCalledWith(
      component.customerId,
      undefined,
      undefined,
      new Date('2024-01-01'),
      new Date('2024-12-31')
    );
  });

  it('should handle null start or end date in onDateChange', () => {
    component.dateForm.setValue({ startDate: null, endDate: '2024-12-31' });
    const mockIssues = [
      { status: component.createdId, channel_plan_id: component.callId, created_at: new Date('2024-01-01') }
    ];
    issuesService.getIssuesDasboard.and.returnValue(of(mockIssues));

    component.onDateChange();

    expect(issuesService.getIssuesDasboard).toHaveBeenCalledWith(
      component.customerId,
      undefined,
      undefined,
      undefined,
      new Date('2024-12-31')
    );
  });

  it('should destroy existing chart if present in createDistribucionCanalChart', () => {
    const ctxSpy = spyOn(document, 'getElementById').and.returnValue(document.createElement('canvas'));
    const mockChart = { destroy: jasmine.createSpy('destroy') } as any;
    spyOn(Chart, 'getChart').and.returnValue(mockChart);

    const mockIssues = [
      { channel_plan_id: component.callId, created_at: '2024-01-01' },
      { channel_plan_id: component.mailId, created_at: '2024-01-02' },
      { channel_plan_id: component.chatboId, created_at: '2024-01-03' }
    ];

    component.createDistribucionCanalChart(mockIssues);

    expect(mockChart.destroy).toHaveBeenCalled();
    expect(ctxSpy).toHaveBeenCalledWith('distribucionCanalChart');
    expect(component.totalCalls).toBe(1);
    expect(component.totalMails).toBe(1);
    expect(component.totalChatbot).toBe(1);
  });

  it('should destroy existing chart if present in createEstadoCasosChart', () => {
    const ctxSpy = spyOn(document, 'getElementById').and.returnValue(document.createElement('canvas'));
    const mockChart = { destroy: jasmine.createSpy('destroy') } as any;
    spyOn(Chart, 'getChart').and.returnValue(mockChart);

    const mockIssues = [
      { status: component.createdId, created_at: '2024-01-01' },
      { status: component.closedId, created_at: '2024-01-02' }
    ];

    component.createEstadoCasosChart(mockIssues);

    expect(mockChart.destroy).toHaveBeenCalled();
    expect(ctxSpy).toHaveBeenCalledWith('estadoCasosChart');
  });

  it('should correctly determine if issue date is within date range', () => {
    const mockIssues = [
      { status: component.createdId, created_at: new Date('2024-01-01') },
      { status: component.closedId, created_at: new Date('2024-02-01') },
      { status: component.inProgressId, created_at: new Date('2024-03-01') }
    ];

    component.initialDate = new Date('2024-01-01');
    component.endDate = new Date('2024-02-15');

    component.createEstadoCasosChart(mockIssues);

    expect(component.totalCreated).toBe(1);
    expect(component.totalClosed).toBe(1);
    expect(component.totalInProgress).toBe(0);
  });

  it('should initialize and load issues data on ngOnInit', () => {
    const mockIssues = [
      { status: component.createdId, channel_plan_id: component.callId, created_at: new Date('2024-01-01') },
      { status: component.closedId, channel_plan_id: component.mailId, created_at: new Date('2024-01-02') },
      { status: component.inProgressId, channel_plan_id: component.chatboId, created_at: new Date('2024-01-03') }
    ];

    issuesService.getIssuesDasboard.and.returnValue(of(mockIssues));

    component.ngOnInit();

    expect(issuesService.getIssuesDasboard).toHaveBeenCalledWith(component.customerId);

    expect(component.totalCreated).toBe(1);
    expect(component.totalClosed).toBe(1);
    expect(component.totalInProgress).toBe(1);
    expect(component.totalCalls).toBe(1);
    expect(component.totalMails).toBe(1);
    expect(component.totalChatbot).toBe(1);
    expect(component.totalIssues).toBe(3);
  });

  it('should handle various date combinations in onDateChange', () => {
    let mockIssues = [
      { status: component.createdId, channel_plan_id: component.callId, created_at: new Date('2024-01-01') }
    ];

    issuesService.getIssuesDasboard.and.returnValue(of(mockIssues));

    component.dateForm.setValue({ startDate: '2024-01-01', endDate: '2024-12-31' });
    component.onDateChange();
    expect(issuesService.getIssuesDasboard).toHaveBeenCalledWith(
      component.customerId, undefined, undefined, new Date('2024-01-01'), new Date('2024-12-31')
    );

    component.dateForm.setValue({ startDate: '2024-01-01', endDate: null });
    component.onDateChange();
    expect(issuesService.getIssuesDasboard).toHaveBeenCalledWith(
      component.customerId, undefined, undefined, new Date('2024-01-01'), undefined
    );

    component.dateForm.setValue({ startDate: null, endDate: '2024-12-31' });
    component.onDateChange();
    expect(issuesService.getIssuesDasboard).toHaveBeenCalledWith(
      component.customerId, undefined, undefined, undefined, new Date('2024-12-31')
    );

    component.dateForm.setValue({ startDate: null, endDate: null });
    component.onDateChange();
    expect(issuesService.getIssuesDasboard).toHaveBeenCalledWith(
      component.customerId, undefined, undefined, undefined, undefined
    );
  });

  it('should handle unexpected values in OnSelectionState', () => {
    const mockEvent = { value: 'unexpectedValue' };
    issuesService.getIssuesDasboard.and.returnValue(of([]));
    component.OnSelectionState(mockEvent as any);

    expect(component.selectedState).toBe('unexpectedValue');
    expect(issuesService.getIssuesDasboard).toHaveBeenCalled();
  });

  it('should handle null values in OnSelectionChange', () => {
    const mockEvent = { value: null };
    issuesService.getIssuesDasboard.and.returnValue(of([]));
    component.OnSelectionChange(mockEvent as any);

    expect(component.selectedOrigen).toBeNull();
    expect(issuesService.getIssuesDasboard).toHaveBeenCalled();
  });
});