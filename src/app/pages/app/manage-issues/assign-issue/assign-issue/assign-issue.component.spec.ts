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
import { of, throwError } from 'rxjs';
import { Issue } from 'src/app/models/issue/issue';
import { IssuesService } from 'src/app/services/issues.service';

import { AssignIssueComponent } from './assign-issue.component';

const mockIssues: Issue[] = [
  {
    id: '',
    auth_user_id: '',
    status: '',
    subject: '',
    description: '',
    created_at: '2023-10-02',
    closed_at: '2023-10-02',
    channel_plan_id: 'issue.channel_plan_id'
  },
  {
    id: '',
    auth_user_id: '',
    status: '',
    subject: '',
    description: '',
    created_at: '2023-10-02',
    closed_at: '2023-10-02',
    channel_plan_id: 'issue.channel_plan_id'
  }
];

describe('AssignIssueComponent', () => {
  let component: AssignIssueComponent;
  let fixture: ComponentFixture<AssignIssueComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockIssuesService: jasmine.SpyObj<IssuesService>;

  beforeEach(() => {
    // Inicializamos los espías correctamente
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockIssuesService = jasmine.createSpyObj('IssuesService', ['getAll']);  // Creamos el espía para 'getAll'

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        AssignIssueComponent,
        RouterTestingModule,
        MatDialogModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        CommonModule,
        TablerIconsModule.pick({ eye: 'eye' }),
        HttpClientTestingModule
      ],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: mockRouter },
        { provide: IssuesService, useValue: mockIssuesService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AssignIssueComponent);
    component = fixture.componentInstance;

    mockIssuesService.getAll.and.returnValue(of(mockIssues));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load issues successfully', () => {
    component.loadIssues();

    expect(mockIssuesService.getAll).toHaveBeenCalled();
    expect(component.issues.length).toBeGreaterThan(0);
  });

  it('should open validation error modal on invalid form submission', () => {
    component.form.setValue({
      issueId: '',
      agentId: '',
    });

    component.submit();
    expect(dialogSpy.open).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Object));
  });

  it('should handle error when loading issues', () => {
    const consoleSpy = spyOn(console, 'error');
    mockIssuesService.getAll.and.returnValue(throwError('Error al cargar los incidentes'));

    component.loadIssues();

    // Verificamos que 'console.error' fue llamado con los dos argumentos correctos
    expect(consoleSpy).toHaveBeenCalledWith('Error al cargar los incidentes', 'Error al cargar los incidentes');
  });
});
