import { ModalPredictiveAnswerComponent } from './modal-predictive-answer.component';
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { TablerIconsModule } from 'angular-tabler-icons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IssuesService } from 'src/app/services/issues.service';
import { AnswerResponse } from '../../../../models/issue/answerai-response';

describe('ModalPredictiveAnswerComponent', () => {
  let component: ModalPredictiveAnswerComponent;
  let fixture: ComponentFixture<ModalPredictiveAnswerComponent>;
  let issuesService: IssuesService;

  const mockDialogData = { userId: 'eeacd878-b1d0-4e3c-adac-817a8c655432' };
  const mockAnswerResponse: AnswerResponse = { answer: 'Predictive analytics response' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ModalPredictiveAnswerComponent,
        TablerIconsModule.pick({ eye: 'eye' }),
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatDialogRef, useValue: {} }
      ]
    });
    fixture = TestBed.createComponent(ModalPredictiveAnswerComponent);
    component = fixture.componentInstance;
    issuesService = TestBed.inject(IssuesService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getPredictiveIAAnswer and load the answer on success', () => {
    spyOn(issuesService, 'getPredictiveAIAnswer').and.returnValue(of(mockAnswerResponse));
    component.getPredictiveIAAnswer(mockDialogData.userId);

    expect(component.isLoading).toBe(false);
    expect(component.answer).toBe(mockAnswerResponse.answer);
    expect(issuesService.getPredictiveAIAnswer).toHaveBeenCalledWith(mockDialogData.userId);
  });

  it('should set isLoading to true while loading answer', () => {
    spyOn(issuesService, 'getPredictiveAIAnswer').and.returnValue(of(mockAnswerResponse));
    component.isLoading = false;

    component.getPredictiveIAAnswer(mockDialogData.userId);

    expect(component.isLoading).toBe(false);
  });

  it('should handle error when getPredictiveIAAnswer fails', () => {
    const errorResponse = { message: 'Error fetching answer' };
    spyOn(issuesService, 'getPredictiveAIAnswer').and.returnValue(throwError(errorResponse));
    spyOn(console, 'error');

    component.getPredictiveIAAnswer(mockDialogData.userId);

    expect(component.isLoading).toBe(false);
    expect(component.answer).toBe('');
    expect(console.error).toHaveBeenCalledWith('Error fetching answer:', errorResponse);
  });
});
