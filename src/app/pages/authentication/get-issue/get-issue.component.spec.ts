import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CoreService } from 'src/app/services/core.service';
import { IssuesService } from 'src/app/services/issues.service';
import { ModalMessageComponent } from '../../app/modal-message/modal-message.component';
import { of, throwError } from 'rxjs';
import { GetIssueComponent } from './get-issue.component';
import { Issue } from 'src/app/models/issue/issue';

describe('GetIssueComponent', () => {
  let component: GetIssueComponent;
  let fixture: ComponentFixture<GetIssueComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockIssuesService: jasmine.SpyObj<IssuesService>;
  let mockService: jasmine.SpyObj<CoreService>;

  beforeEach(async () => {
    // const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockIssuesService = jasmine.createSpyObj('IssuesService', ['getIssueById']);
    mockService = jasmine.createSpyObj('CoreService', ['getOptions']);
    // dialogSpy.open.and.returnValue(mockDialogRef);  // Mock open to return a mock dialog reference


    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        GetIssueComponent,
        RouterTestingModule.withRoutes([]),
        MatDialogModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        CommonModule,
        TablerIconsModule.pick({ eye: 'eye' }),
        HttpClientTestingModule,

      ],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: IssuesService, useValue: mockIssuesService },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();


  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  describe('submit', () => {
    it('should open error dialog when form is invalid', () => {
      component.form.get('issueId')?.setValue('');
      const mockIssue: Issue = {
        id: '123',
        auth_user_id: 'user_456',
        auth_user_agent_id: 'agent_789',
        subject: 'Test Issue Subject',
        description: 'This is a mock description of the issue.',
        file: new File([''], 'mockFile.txt', { type: 'text/plain' }),
        status: 'open',
        created_at: '2024-11-05T12:00:00Z'
      };

      mockIssuesService.getIssueById.and.returnValue(of(mockIssue));
      component.submit();

      expect(dialogSpy.open).toHaveBeenCalledWith(ModalMessageComponent, {
        data: {
          title: 'Incidente',
          message: 'Favor ingresar un numero de radicado!',
          buttonCloseTitle: 'Aceptar'
        },
      });
    });
  });

});