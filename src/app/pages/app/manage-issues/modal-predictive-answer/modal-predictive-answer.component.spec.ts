import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPredictiveAnswerComponent } from './modal-predictive-answer.component';

describe('ModalPredictiveAnswerComponent', () => {
  let component: ModalPredictiveAnswerComponent;
  let fixture: ComponentFixture<ModalPredictiveAnswerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalPredictiveAnswerComponent]
    });
    fixture = TestBed.createComponent(ModalPredictiveAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
