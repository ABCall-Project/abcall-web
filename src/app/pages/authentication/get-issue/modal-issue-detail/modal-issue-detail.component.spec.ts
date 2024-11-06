import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Issue } from 'src/app/models/issue/issue';
import { IssuesService } from 'src/app/services/issues.service';
import { ModalIssueDetailComponent } from './modal-issue-detail.component';

describe('ModalIssueDetailComponent', () => {
  let component: ModalIssueDetailComponent;
  let fixture: ComponentFixture<ModalIssueDetailComponent>;
  let mockIssuesService: jasmine.SpyObj<IssuesService>;
  let mockIssue: Issue;



  beforeEach(async () => {
    mockIssue = {
      id: '123',
      subject: 'Test Issue',
      description: 'Test description',
      status: 'Open',
      // Agregar otros campos necesarios según la interfaz `Issue`
    };
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        ModalIssueDetailComponent,
        RouterTestingModule.withRoutes([]),
        MatDialogModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        CommonModule,
        TablerIconsModule.pick({ eye: 'eye' }),
        HttpClientTestingModule,

      ],// Import the standalone component here
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { issue: mockIssue } }
      ]
    });
    fixture = TestBed.createComponent(ModalIssueDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});
