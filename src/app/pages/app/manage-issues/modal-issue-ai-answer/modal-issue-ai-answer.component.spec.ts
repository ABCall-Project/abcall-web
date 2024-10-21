import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIssueAiAnswerComponent } from './modal-issue-ai-answer.component';

describe('ModalIssueAiAnswerComponent', () => {
  let component: ModalIssueAiAnswerComponent;
  let fixture: ComponentFixture<ModalIssueAiAnswerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalIssueAiAnswerComponent]
    });
    fixture = TestBed.createComponent(ModalIssueAiAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
