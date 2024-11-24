import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PredictiveDashboardComponent } from './predictive-dashboard.component';
import { IssuesService } from 'src/app/services/issues.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



const mockIssuesService = {
  getTopSevenIssues: jasmine.createSpy('getTopSevenIssues').and.returnValue(of([
    { id: '1', subject: 'Falla Técnica' },
    { id: '2', subject: 'Error Humano' },
    { id: '3', subject: 'Interrupción' },
  ])),
  getPredictiveData: jasmine.createSpy('getPredictiveData').and.returnValue(of({
    realDatabyDay: [10, 20, 15, 12, 18, 14, 16],
    predictedDatabyDay: [11, 21, 14, 13, 19, 13, 15],
    realDataIssuesType: [5, 8, 12],
    predictedDataIssuesType: [6, 9, 13],
    issueQuantity: [100, 200, 150],
  }))
};

describe('PredictiveDashboardComponent', () => {
  let component: PredictiveDashboardComponent;
  let fixture: ComponentFixture<PredictiveDashboardComponent>;
  let issuesService: IssuesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PredictiveDashboardComponent, 
        HttpClientTestingModule,
        BrowserAnimationsModule 
      ],
      providers: [
        { provide: IssuesService, useValue: mockIssuesService },
      ],
      schemas: [NO_ERRORS_SCHEMA] 
    }).compileComponents();
  
    fixture = TestBed.createComponent(PredictiveDashboardComponent);
    component = fixture.componentInstance;
    issuesService = TestBed.inject(IssuesService);
  });
  

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getTopSevenIssues and populate issueTypes', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(issuesService.getTopSevenIssues).toHaveBeenCalled();
    expect(component.issueTypes).toEqual(['Falla Técnica', 'Error Humano', 'Interrupción']);
  });

  it('should call renderCharts on getTopSevenIssues response', () => {
    spyOn(component, 'renderCharts');
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.renderCharts).toHaveBeenCalled();
  });

  it('should render charts with predictive data', () => {
    spyOn(component, 'createChartIssuesByDay');
    spyOn(component, 'createChartWaitingTime');
    spyOn(component, 'createProbabilityChart');

    component.renderCharts();
    fixture.detectChanges();

    expect(issuesService.getPredictiveData).toHaveBeenCalled();
    expect(component.createChartIssuesByDay).toHaveBeenCalledWith(
      [10, 20, 15, 12, 18, 14, 16],
      [11, 21, 14, 13, 19, 13, 15],
      ''
    );
    expect(component.createChartWaitingTime).toHaveBeenCalledWith(
      ['Falla Técnica', 'Error Humano', 'Interrupción'],
      [5, 8, 12],
      [6, 9, 13],
      ''
    );
    expect(component.createProbabilityChart).toHaveBeenCalledWith(
      ['Falla Técnica', 'Error Humano', 'Interrupción'],
      [100, 200, 150],
      ''
    );
  });

  it('should reset the form and call renderCharts', () => {
    spyOn(component, 'renderCharts');
    component.resetForm();
    expect(component.selectedIssueType).toBeNull();
    expect(component.selectedWeekDay).toBeNull();
    expect(component.renderCharts).toHaveBeenCalled();
  });

  it('should update selectedIssueType and call renderCharts on OnSelectionIssueType', () => {
    spyOn(component, 'renderCharts');
    const event = { value: 'Falla Técnica' } as any; // Simula el evento

    component.OnSelectionIssueType(event);

    expect(component.selectedIssueType).toBe('Falla Técnica');
    expect(component.renderCharts).toHaveBeenCalled();
  });

  it('should update selectedWeekDay and call renderCharts on OnSelectionWeekDay', () => {
    spyOn(component, 'renderCharts');
    const event = { value: 'Miércoles' } as any; 

    component.OnSelectionWeekDay(event);

    expect(component.selectedWeekDay).toBe('Miércoles');
    expect(component.renderCharts).toHaveBeenCalled();
  });
});
