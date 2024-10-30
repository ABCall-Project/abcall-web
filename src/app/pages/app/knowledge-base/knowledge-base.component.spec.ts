import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KnowledgeBaseComponent } from './knowledge-base.component';

describe('KnowledgeBaseComponent', () => {
  let component: KnowledgeBaseComponent;
  let fixture: ComponentFixture<KnowledgeBaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KnowledgeBaseComponent]  // Cambiado a imports
    });
    fixture = TestBed.createComponent(KnowledgeBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});