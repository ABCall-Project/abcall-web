import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueStateComponent } from './issue-state.component';

describe('IssueStateComponent', () => {
  let component: IssueStateComponent;
  let fixture: ComponentFixture<IssueStateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IssueStateComponent]
    });
    fixture = TestBed.createComponent(IssueStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
