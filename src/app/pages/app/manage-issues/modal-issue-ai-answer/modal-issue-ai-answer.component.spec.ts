import { ModalIssueAiAnswerComponent } from './modal-issue-ai-answer.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { TablerIconsModule } from 'angular-tabler-icons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IssuesService } from 'src/app/services/issues.service';
import { AnswerResponse } from '../../../../models/issue/answerai-response';

describe('ModalIssueAiAnswerComponent', () => {
  let component: ModalIssueAiAnswerComponent;
  let fixture: ComponentFixture<ModalIssueAiAnswerComponent>;
  let issuesService: IssuesService;

  const mockDialogData = { question: 'qué es AI' };
  const mockAnswerResponse: AnswerResponse = { answer: 'Respuesta de AI sobre inteligencia artificial' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ModalIssueAiAnswerComponent,
        TablerIconsModule.pick({ eye: 'eye' }),
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatDialogRef, useValue: {} }
      ]
    });
    fixture = TestBed.createComponent(ModalIssueAiAnswerComponent);
    component = fixture.componentInstance;
    issuesService = TestBed.inject(IssuesService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getIAAnswer and load the answer on success', () => {
    spyOn(issuesService, 'getAnswer').and.returnValue(of(mockAnswerResponse));

    component.getIAAnswer(mockDialogData.question);

    expect(component.isLoading).toBe(false);
    expect(component.answer).toBe(mockAnswerResponse.answer);
    expect(issuesService.getAnswer).toHaveBeenCalledWith(mockDialogData.question);
  });

  it('should set isLoading to true while loading answer', () => {
    spyOn(issuesService, 'getAnswer').and.returnValue(of(mockAnswerResponse));

    component.getIAAnswer(mockDialogData.question);

    expect(component.isLoading).toBe(false);
  });

  it('should handle error when getIAAnswer fails', () => {
    const errorResponse = { message: 'Error fetching answer' };
    spyOn(issuesService, 'getAnswer').and.returnValue(throwError(errorResponse));
    spyOn(console, 'error');

    component.getIAAnswer(mockDialogData.question);

    expect(component.isLoading).toBe(false);
    expect(component.answer).toBe('');
    expect(console.error).toHaveBeenCalledWith('Error fetching answer:', errorResponse);
  });
});
