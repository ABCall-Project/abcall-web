
import { ModalIssueAiAnswerComponent } from './modal-issue-ai-answer.component';

import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { TablerIconsModule } from 'angular-tabler-icons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ModalIssueAiAnswerComponent', () => {
  let component: ModalIssueAiAnswerComponent;
  let fixture: ComponentFixture<ModalIssueAiAnswerComponent>;

  const mockDialogData = {
    question: 'qué es AI'
  };
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
