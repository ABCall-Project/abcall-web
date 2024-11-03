import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IssueStateComponent } from './issue-state.component';

describe('IssueStateComponent', () => {
  let component: IssueStateComponent;
  let fixture: ComponentFixture<IssueStateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IssueStateComponent]
    });
    fixture = TestBed.createComponent(IssueStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should log "Cerrando el diálogo" when close is called', () => {
    spyOn(console, 'log');
    component.close();
    expect(console.log).toHaveBeenCalledWith("Cerrando el diálogo");
  });
});