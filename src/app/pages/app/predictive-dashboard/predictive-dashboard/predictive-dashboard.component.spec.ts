import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictiveDashboardComponent } from './predictive-dashboard.component';

describe('PredictiveDashboardComponent', () => {
  let component: PredictiveDashboardComponent;
  let fixture: ComponentFixture<PredictiveDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PredictiveDashboardComponent]
    });
    fixture = TestBed.createComponent(PredictiveDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
